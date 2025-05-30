import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { APP_CONFIG } from '../constants';

interface RequestQueueItem {
  url: string;
  config?: AxiosRequestConfig;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  data?: unknown;
  resolve: (response: AxiosResponse) => void;
  reject: (error: unknown) => void;
  retryCount: number;
}

interface RateLimitConfig {
  minRequestDelay: number;
  maxRequestDelay: number;
  jitterRange: number;
  maxRetries: number;
  backoffMultiplier: number;
  maxBackoff: number;
  sessionTimeout: number;
}

export class RateLimitedHttpClient {
  private static instance: RateLimitedHttpClient;
  private httpClient: AxiosInstance;
  private lastRequestTime: number = 0;
  private requestQueue: RequestQueueItem[] = [];
  private isProcessingQueue: boolean = false;
  private config: RateLimitConfig;

  private constructor() {
    // Rate limiting configuration
    this.config = {
      minRequestDelay: 3000,     // 3 seconds minimum
      maxRequestDelay: 10000,    // 10 seconds maximum  
      jitterRange: 2000,         // ±2 seconds random
      maxRetries: 3,             // Maximum retry attempts
      backoffMultiplier: 2,      // Exponential backoff (2x)
      maxBackoff: 60000,         // 60 seconds maximum backoff
      sessionTimeout: 1800000,   // 30 minutes
    };

    // Configure HTTP client
    this.httpClient = axios.create({
      timeout: APP_CONFIG.SYNC_TIMEOUT_MS,
      headers: {
        'User-Agent': this.getRandomUserAgent(),
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
        'Accept-Encoding': 'gzip, deflate, br',
        'Connection': 'keep-alive',
        'Upgrade-Insecure-Requests': '1',
        'Sec-Fetch-Dest': 'document',
        'Sec-Fetch-Mode': 'navigate',
        'Sec-Fetch-Site': 'same-origin',
        'Sec-Fetch-User': '?1',
        'Cache-Control': 'max-age=0',
      },
    });

    // Add response interceptor to handle server responses
    this.httpClient.interceptors.response.use(
      (response) => this.handleSuccessResponse(response),
      (error) => this.handleErrorResponse(error),
    );
  }

  public static getInstance(): RateLimitedHttpClient {
    if (!RateLimitedHttpClient.instance) {
      RateLimitedHttpClient.instance = new RateLimitedHttpClient();
    }
    return RateLimitedHttpClient.instance;
  }

  /**
   * Make a rate-limited GET request
   */
  public async get(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse> {
    return this.queueRequest(url, 'GET', undefined, config);
  }

  /**
   * Make a rate-limited POST request
   */
  public async post(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<AxiosResponse> {
    return this.queueRequest(url, 'POST', data, config);
  }

  /**
   * Make a rate-limited PUT request
   */
  public async put(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<AxiosResponse> {
    return this.queueRequest(url, 'PUT', data, config);
  }

  /**
   * Make a rate-limited DELETE request
   */
  public async delete(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse> {
    return this.queueRequest(url, 'DELETE', undefined, config);
  }

  /**
   * Queue a request for rate-limited execution
   */
  private async queueRequest(
    url: string, 
    method: 'GET' | 'POST' | 'PUT' | 'DELETE', 
    data?: unknown, 
    config?: AxiosRequestConfig,
  ): Promise<AxiosResponse> {
    return new Promise((resolve, reject) => {
      const queueItem: RequestQueueItem = {
        url,
        config,
        method,
        data,
        resolve,
        reject,
        retryCount: 0,
      };

      this.requestQueue.push(queueItem);
      
      if (!this.isProcessingQueue) {
        this.processQueue();
      }
    });
  }

  /**
   * Process the request queue with rate limiting
   */
  private async processQueue(): Promise<void> {
    if (this.isProcessingQueue || this.requestQueue.length === 0) {
      return;
    }

    this.isProcessingQueue = true;

    while (this.requestQueue.length > 0) {
      const queueItem = this.requestQueue.shift();
      if (!queueItem) break;
      
      try {
        // Wait for rate limit before making request
        await this.waitForRateLimit();
        
        // Execute the request
        const response = await this.executeRequest(queueItem);
        queueItem.resolve(response);
        
      } catch (error) {
        // Handle retries
        if (queueItem.retryCount < this.config.maxRetries && this.shouldRetry(error)) {
          console.log(`🔄 Retrying request ${queueItem.retryCount + 1}/${this.config.maxRetries}: ${queueItem.url}`);
          
          // Exponential backoff delay
          const backoffDelay = Math.min(
            this.config.backoffMultiplier ** queueItem.retryCount * 1000,
            this.config.maxBackoff,
          );
          
          await new Promise(resolve => {
            const timer = global.setTimeout(() => resolve(undefined), backoffDelay);
            return timer;
          });
          
          queueItem.retryCount++;
          this.requestQueue.unshift(queueItem); // Re-add to front of queue
        } else {
          queueItem.reject(error);
        }
      }
    }

    this.isProcessingQueue = false;
  }

  /**
   * Wait for rate limit before making next request
   */
  private async waitForRateLimit(): Promise<void> {
    const now = Date.now();
    const timeSinceLastRequest = now - this.lastRequestTime;
    
    // Calculate delay with jitter
    const baseDelay = this.config.minRequestDelay;
    const jitter = (Math.random() - 0.5) * this.config.jitterRange; // ±jitterRange/2
    const totalDelay = Math.max(baseDelay + jitter, 1000); // Minimum 1 second
    
    if (timeSinceLastRequest < totalDelay) {
      const delayNeeded = totalDelay - timeSinceLastRequest;
      console.log(`⏳ Rate limiting: waiting ${Math.round(delayNeeded)}ms before next request`);
      await new Promise(resolve => {
        const timer = global.setTimeout(() => resolve(undefined), delayNeeded);
        return timer;
      });
    }
    
    this.lastRequestTime = Date.now();
  }

  /**
   * Execute the actual HTTP request
   */
  private async executeRequest(queueItem: RequestQueueItem): Promise<AxiosResponse> {
    const { url, method, data, config } = queueItem;
    
    console.log(`🌐 Making ${method} request to: ${url}`);
    
    switch (method) {
    case 'GET':
      return await this.httpClient.get(url, config);
    case 'POST':
      return await this.httpClient.post(url, data, config);
    case 'PUT':
      return await this.httpClient.put(url, data, config);
    case 'DELETE':
      return await this.httpClient.delete(url, config);
    default:
      throw new Error(`Unsupported HTTP method: ${method}`);
    }
  }

  /**
   * Handle successful responses
   */
  private handleSuccessResponse(response: AxiosResponse): AxiosResponse {
    console.log(`✅ Request successful: ${response.status} ${response.config?.url}`);
    
    // Check for potential issues even in "successful" responses
    if (response.data && typeof response.data === 'string') {
      if (this.isCaptchaPage(response.data)) {
        console.warn('🤖 Captcha detected in response');
        throw new Error('CAPTCHA_REQUIRED: Manual verification needed');
      }
      
      if (this.isMaintenancePage(response.data)) {
        console.warn('🔧 Maintenance page detected');
        throw new Error('SERVICE_MAINTENANCE: Server is under maintenance');
      }
    }
    
    return response;
  }

  /**
   * Handle error responses with proper server respect
   */
  private handleErrorResponse(error: unknown): Promise<never> {
    const response = (error as { response?: { status: number; headers: Record<string, string>; data?: string } })?.response;
    
    if (response) {
      const status = response.status;
      console.log(`❌ Request failed: ${status} ${(error as { config?: { url?: string } })?.config?.url}`);
      
      switch (status) {
      case 429: {
        // Too Many Requests
        const retryAfter = response.headers['retry-after'];
        const delay = retryAfter ? parseInt(retryAfter) * 1000 : 60000;
        console.warn(`🚫 Rate limited by server. Retry after: ${delay}ms`);
        (error as { retryAfter?: number }).retryAfter = delay;
        break;
      }
      case 503:
        // Service Unavailable
        console.warn('🔧 Service unavailable');
        (error as { serviceUnavailable?: boolean }).serviceUnavailable = true;
        break;
      case 403:
        // Forbidden
        if (response.data && this.isCaptchaPage(response.data)) {
          console.warn('🤖 Captcha challenge detected');
          (error as { captchaRequired?: boolean }).captchaRequired = true;
        }
        break;
      case 404:
        // Not Found
        console.warn('📭 Resource not found');
        break;
      case 500:
      case 502:
      case 504:
        // Server errors
        console.warn(`🔥 Server error: ${status}`);
        break;
      default:
        break;
      }
    } else {
      const errorCode = (error as { code?: string })?.code;
      const errorMessage = (error as { message?: string })?.message;
      
      if (errorCode === 'ECONNABORTED') {
        console.warn('⏱️ Request timeout');
      } else if (errorCode === 'ENOTFOUND') {
        console.warn('🌐 Network error - DNS resolution failed');
      } else {
        console.warn('🔌 Network error:', errorMessage);
      }
    }
    
    return Promise.reject(error);
  }

  /**
   * Determine if an error should trigger a retry
   */
  private shouldRetry(error: unknown): boolean {
    const response = (error as { response?: { status: number } })?.response;
    
    // Don't retry on client errors (4xx except specific cases)
    if (response && response.status >= 400 && response.status < 500) {
      // Retry on rate limiting and service unavailable
      return response.status === 429 || response.status === 503;
    }
    
    // Retry on server errors (5xx) and network errors
    if (response && response.status >= 500) {
      return true;
    }
    
    // Retry on timeout and network errors
    const errorCode = (error as { code?: string })?.code;
    if (errorCode === 'ECONNABORTED' || errorCode === 'ENOTFOUND') {
      return true;
    }
    
    return false;
  }

  /**
   * Check if response contains captcha challenge
   */
  private isCaptchaPage(html: string): boolean {
    const lowerHtml = html.toLowerCase();
    return lowerHtml.includes('captcha') || 
           lowerHtml.includes('recaptcha') || 
           lowerHtml.includes('verification') ||
           lowerHtml.includes('robot') ||
           lowerHtml.includes('challenge');
  }

  /**
   * Check if response is a maintenance page
   */
  private isMaintenancePage(html: string): boolean {
    const lowerHtml = html.toLowerCase();
    return lowerHtml.includes('maintenance') ||
           lowerHtml.includes('temporarily unavailable') ||
           lowerHtml.includes('service unavailable') ||
           lowerHtml.includes('under construction');
  }

  /**
   * Get a random user agent to vary requests
   */
  private getRandomUserAgent(): string {
    const userAgents = APP_CONFIG.USER_AGENTS;
    return userAgents[Math.floor(Math.random() * userAgents.length)];
  }

  /**
   * Update request headers (e.g., for session cookies)
   */
  public updateHeaders(headers: Record<string, string>): void {
    Object.assign(this.httpClient.defaults.headers, headers);
  }

  /**
   * Get current configuration
   */
  public getConfig(): RateLimitConfig {
    return { ...this.config };
  }

  /**
   * Update rate limiting configuration
   */
  public updateConfig(newConfig: Partial<RateLimitConfig>): void {
    this.config = { ...this.config, ...newConfig };
  }
} 