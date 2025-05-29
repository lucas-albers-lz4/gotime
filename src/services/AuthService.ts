import axios, { AxiosInstance } from 'axios';
import { Platform } from 'react-native';
import { UserCredentials, LoginResponse, AuthResult } from '../types';
import { APP_CONFIG } from '../constants';
import StorageService from './StorageService';

export class AuthService {
  private static instance: AuthService;
  private httpClient: AxiosInstance;
  private sessionToken: string | null = null;
  private f5SessionId: string | null = null;
  private currentUserAgent: string;
  private isWebPlatform: boolean;
  private storageService: typeof StorageService;
  private sessionData: Record<string, unknown> | null = null;

  private constructor() {
    this.isWebPlatform = Platform.OS === 'web';
    
    // Set appropriate User-Agent based on platform
    this.currentUserAgent = this.isWebPlatform
      ? 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      : 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1';

    // Configure HTTP client for ESS requests
    this.httpClient = axios.create({
      timeout: APP_CONFIG.SYNC_TIMEOUT_MS,
      headers: {
        'User-Agent': this.currentUserAgent,
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
        'Accept-Encoding': 'gzip, deflate, br',
        'DNT': '1',
        'Connection': 'keep-alive',
        'Upgrade-Insecure-Requests': '1',
      },
    });

    this.storageService = StorageService;
  }

  public static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  /**
   * Attempt to authenticate with Costco ESS portal
   * 
   * AUTHENTICATION FLOW DOCUMENTATION:
   * 1. POST credentials to https://ess.costco.com/
   * 2. Server responds with SAML redirect to https://login.costco.com/idp/SSO.saml2
   * 3. SAML SSO redirects to https://authenticator.pingone.com/pingid/ppm/auth for 2FA
   * 4. User receives SMS code and enters it on the 2FA page
   * 5. After 2FA success, redirects back to https://ess.costco.com/irj/portal/external
   * 6. User navigates to "Online Employee Schedules" tab
   * 7. Redirects to Cognos BI: https://bireport.costco.com/cognos_ext/bi/...
   * 8. User selects week from dropdown and clicks "Run" to get schedule
   */
  public async login(credentials: UserCredentials): Promise<AuthResult> {
    try {
      console.log('🔐 Starting Costco ESS authentication...');
      
      // Check platform limitations
      if (Platform.OS === 'web') {
        return {
          success: false,
          error: 'Web platform authentication not supported due to CORS restrictions. Please use the mobile app.',
        };
      }

      // Validate credentials
      if (!credentials.employeeId || !credentials.password) {
        return {
          success: false,
          error: 'Employee ID and password are required',
        };
      }

      // Step 1: Initial login attempt to ESS portal
      const initialResult = await this.attemptESSLogin(credentials);
      if (!initialResult.success) {
        return initialResult;
      }

      // Step 2: Handle SAML redirect
      if (initialResult.requiresMFA) {
        return {
          success: false,
          requiresMFA: true,
          mfaMethod: 'sms',
          error: 'SAML Single Sign-On with 2FA required. This complex authentication flow is not yet implemented in the mobile app.',
          sessionData: initialResult.sessionData,
        };
      }

      // If we somehow get past SAML (unlikely), save credentials
      if (credentials.rememberMe) {
        await this.saveCredentials(credentials);
      }

      return {
        success: true,
        sessionData: initialResult.sessionData,
      };

    } catch (error) {
      console.error('❌ Authentication error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown authentication error',
      };
    }
  }

  /**
   * Attempt initial login to ESS portal
   */
  private async attemptESSLogin(credentials: UserCredentials): Promise<AuthResult> {
    try {
      const loginUrl = 'https://ess.costco.com/';
      
      // Prepare login request
      const loginData = new FormData();
      loginData.append('username', credentials.employeeId);
      loginData.append('password', credentials.password);

      const response = await fetch(loginUrl, {
        method: 'POST',
        headers: {
          'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
          'Accept-Language': 'en-US,en;q=0.5',
          'Accept-Encoding': 'gzip, deflate, br',
          'Content-Type': 'application/x-www-form-urlencoded',
          'Origin': 'https://ess.costco.com',
          'Referer': 'https://ess.costco.com/',
          'Upgrade-Insecure-Requests': '1',
        },
        body: loginData,
        redirect: 'manual', // Don't follow redirects automatically
      });

      const responseText = await response.text();
      const responseUrl = response.url;

      console.log('📍 Response URL:', responseUrl);
      console.log('📊 Response Status:', response.status);

      // Check for various response patterns
      if (this.isLogoutPage(responseText)) {
        return {
          success: false,
          error: 'Login failed: Invalid credentials or session expired',
        };
      }

      if (this.isSAMLRedirect(responseText, responseUrl)) {
        return {
          success: false,
          requiresMFA: true,
          mfaMethod: 'sms',
          error: 'SAML SSO redirect detected',
          sessionData: { responseText, responseUrl },
        };
      }

      if (this.isSuccessfulLogin(responseText, responseUrl)) {
        return {
          success: true,
          sessionData: { responseText, responseUrl },
        };
      }

      // Extract any error messages
      const errorMessage = this.extractErrorMessage(responseText);
      
      return {
        success: false,
        error: errorMessage || 'Unknown login error',
      };

    } catch (error) {
      console.error('ESS login error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Network error during login',
      };
    }
  }

  /**
   * Check if response indicates a logout page
   */
  private isLogoutPage(html: string): boolean {
    const logoutIndicators = [
      'BIG-IP logout page',
      'session expired',
      'logged out',
      'session has been terminated',
    ];
    
    const lowerHtml = html.toLowerCase();
    return logoutIndicators.some(indicator => lowerHtml.includes(indicator));
  }

  /**
   * Check if response indicates SAML redirect
   */
  private isSAMLRedirect(html: string, url: string): boolean {
    return (
      html.includes('SAMLRequest') ||
      url.includes('login.costco.com') ||
      url.includes('authenticator.pingone.com') ||
      html.includes('saml2')
    );
  }

  /**
   * Check if login was successful
   */
  private isSuccessfulLogin(html: string, url: string): boolean {
    return (
      url.includes('irj/portal/external') ||
      html.includes('Employee Self Service') ||
      html.includes('Online Employee Schedules')
    );
  }

  /**
   * Extract error message from response
   */
  private extractErrorMessage(html: string): string | null {
    // Look for common error patterns
    const errorPatterns = [
      /<div[^>]*class="[^"]*error[^"]*"[^>]*>([^<]+)</i,
      /<span[^>]*class="[^"]*error[^"]*"[^>]*>([^<]+)</i,
      /<p[^>]*class="[^"]*error[^"]*"[^>]*>([^<]+)</i,
      /error[^:]*:\s*([^<\n]+)/i,
      /invalid[^<\n]+/i,
      /authentication failed[^<\n]*/i,
    ];

    for (const pattern of errorPatterns) {
      const match = html.match(pattern);
      if (match) {
        return match[1]?.trim() || match[0]?.trim();
      }
    }

    return null;
  }

  /**
   * Save credentials securely
   */
  private async saveCredentials(credentials: UserCredentials): Promise<void> {
    try {
      // Use the existing storeCredentials method
      await this.storageService.storeCredentials(credentials);
      console.log('✅ Credentials saved securely');
    } catch (error) {
      console.error('❌ Failed to save credentials:', error);
    }
  }

  /**
   * Get saved credentials
   */
  public async getSavedCredentials(): Promise<Partial<UserCredentials> | null> {
    try {
      const credentials = await this.storageService.getCredentials();
      return credentials;
    } catch (error) {
      console.error('❌ Failed to get saved credentials:', error);
      return null;
    }
  }

  /**
   * Clear saved credentials
   */
  public async clearCredentials(): Promise<void> {
    try {
      await this.storageService.clearCredentials();
      this.sessionData = null;
      console.log('✅ Credentials cleared');
    } catch (error) {
      console.error('❌ Failed to clear credentials:', error);
    }
  }

  /**
   * Check if user is logged in
   */
  public isLoggedIn(): boolean {
    return this.sessionData !== null;
  }

  /**
   * Logout user
   */
  public async logout(): Promise<void> {
    try {
      this.sessionData = null;
      // Note: In a real implementation, you would also make a logout request to the server
      console.log('✅ User logged out');
    } catch (error) {
      console.error('❌ Logout error:', error);
    }
  }

  /**
   * Get current session data
   */
  public getSessionData(): Record<string, unknown> | null {
    return this.sessionData;
  }

  /**
   * Validate current session (placeholder for future implementation)
   */
  public async validateSession(): Promise<boolean> {
    // In a real implementation, this would check if the session is still valid
    // by making a request to a protected endpoint
    return this.sessionData !== null;
  }

  /**
   * Handle 2FA verification (placeholder for future implementation)
   */
  public async verify2FA(_code: string, _sessionData: Record<string, unknown>): Promise<AuthResult> {
    // This would handle the PingOne 2FA verification
    return {
      success: false,
      error: '2FA verification not yet implemented. This requires handling the PingOne authentication flow.',
    };
  }

  /**
   * Navigate to schedule page (placeholder for future implementation)
   */
  public async navigateToSchedules(_sessionData: Record<string, unknown>): Promise<AuthResult> {
    // This would handle navigation through the ESS portal to the Cognos BI schedules
    return {
      success: false,
      error: 'Schedule navigation not yet implemented. This requires automating the ESS portal navigation.',
    };
  }

  // Attempt to login to Costco ESS portal
  async loginToCostco(username: string, password: string): Promise<LoginResponse> {
    // Check if running on web platform
    if (this.isWebPlatform) {
      console.log('🌐 Web platform detected - ESS login not supported due to CORS');
      return {
        success: false,
        requiresSMS: false,
        error: 'Web platform not supported. Please use the mobile app for ESS login due to CORS restrictions.',
      };
    }

    try {
      console.log('=== STARTING ESS LOGIN PROCESS ===');
      console.log('Platform:', Platform.OS);
      console.log('Username:', username ? `${username.substring(0, 3)}***` : 'empty');
      console.log('Password:', password ? '***provided***' : 'empty');
      console.log('Target URL:', APP_CONFIG.COSTCO_URLS.LOGIN);
      
      // Step 1: Get the ESS login page to establish F5 session
      console.log('Step 1: Fetching ESS login page...');
      const loginPageResponse = await this.httpClient.get(APP_CONFIG.COSTCO_URLS.LOGIN);
      console.log('Login page response status:', loginPageResponse.status);
      console.log('Login page response headers:', Object.keys(loginPageResponse.headers));
      console.log('Login page content length:', loginPageResponse.data?.length || 0);
      console.log('Login page content preview:', loginPageResponse.data?.substring(0, 200) + '...');
      
      // Extract F5 session from cookies
      console.log('Step 2: Extracting F5 session...');
      this.extractF5Session(loginPageResponse.headers['set-cookie']);
      console.log('F5 Session ID:', this.f5SessionId ? 'extracted' : 'not found');
      
      // Check for F5 BIG-IP session errors
      if (loginPageResponse.data.includes('BIG-IP can not find session information')) {
        console.log('F5 BIG-IP session error detected - attempting to establish new session');
        // Try to click the "click here" link to establish new session
        const newSessionResponse = await this.httpClient.get(APP_CONFIG.COSTCO_URLS.BASE);
        console.log('New session response status:', newSessionResponse.status);
        this.extractF5Session(newSessionResponse.headers['set-cookie']);
        console.log('F5 Session ID after retry:', this.f5SessionId ? 'extracted' : 'still not found');
      }
      
      // Extract ESS-specific form fields using regex
      console.log('Step 3: Extracting form fields...');
      const essFields = this.extractESSFormFields(loginPageResponse.data);
      console.log('Extracted form fields:', Object.keys(essFields));
      console.log('Form field values:', essFields);
      
      // Step 2: Submit credentials to ESS portal
      console.log('Step 4: Submitting login credentials...');
      const loginData = {
        username: username,
        password: password,
        ...essFields, // Include ESS-specific hidden fields
      };
      console.log('Login data keys:', Object.keys(loginData));

      const loginResponse = await this.httpClient.post(
        APP_CONFIG.COSTCO_URLS.LOGIN,
        new URLSearchParams(loginData),
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Referer': APP_CONFIG.COSTCO_URLS.LOGIN,
            'Origin': APP_CONFIG.COSTCO_URLS.BASE,
          },
          maxRedirects: 5, // Allow ESS redirects
          validateStatus: (status) => status < 400,
        },
      );

      console.log('Login response status:', loginResponse.status);
      console.log('Login response headers:', Object.keys(loginResponse.headers));
      console.log('Login response URL:', loginResponse.config?.url);

      // Extract ESS session information
      console.log('Step 5: Extracting session information...');
      this.extractESSSession(loginResponse.headers['set-cookie']);
      console.log('Session token:', this.sessionToken ? 'extracted' : 'not found');
      
      const responseText = loginResponse.data;
      console.log('Response content length:', responseText?.length || 0);
      console.log('Response content preview:', responseText?.substring(0, 500) + '...');
      
      // Log more details about the response for debugging
      if (responseText?.includes('SAMLRequest')) {
        console.log('🔍 SAML Request detected in response');
        console.log('🔍 Full response (first 1000 chars):', responseText.substring(0, 1000));
      }
      
      if (responseText?.includes('logout')) {
        console.log('🔍 Logout page detected');
        console.log('🔍 Looking for session establishment message...');
        const sessionMatch = responseText.match(/To open a new session[^<]*</i);
        if (sessionMatch) {
          console.log('🔍 Session message found:', sessionMatch[0]);
        }
      }

      // Check for ESS-specific success indicators
      console.log('Step 6: Checking for success indicators...');
      const isSuccess = this.isESSLoginSuccessful(responseText);
      console.log('Login success check result:', isSuccess);
      
      if (isSuccess) {
        console.log('✅ ESS login successful');
        return {
          success: true,
          requiresSMS: false,
          sessionToken: this.sessionToken || undefined,
        };
      }

      // Check for SAML authentication flow BEFORE checking MFA
      if (responseText.includes('SAMLRequest') || responseText.includes('saml')) {
        console.log('🔄 SAML authentication flow detected - following SAML redirect...');
        return await this.handleSAMLFlow(responseText, essFields);
      }

      // Check for SMS/MFA requirement (only if not SAML and not logout page)
      console.log('Step 7: Checking for MFA requirement...');
      const requiresMFA = this.requiresMFA(responseText);
      console.log('MFA required check result:', requiresMFA);
      
      if (requiresMFA) {
        console.log('🔐 MFA verification required');
        return {
          success: false,
          requiresSMS: true,
        };
      }

      // Check for ESS authentication errors
      console.log('Step 8: Checking for error messages...');
      const errorMessage = this.extractESSError(responseText);
      console.log('Extracted error message:', errorMessage || 'none found');
      
      if (errorMessage) {
        console.log('❌ Login failed with error:', errorMessage);
        return {
          success: false,
          requiresSMS: false,
          error: errorMessage,
        };
      }

      // Unknown response
      console.log('❓ Unknown response - login status unclear');
      console.log('Full response for debugging:', responseText);
      return {
        success: false,
        requiresSMS: false,
        error: 'Unexpected response from ESS server',
      };

    } catch (error) {
      console.error('💥 ESS login failed with exception:', error);
      console.error('Error details:', {
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined,
        response: (error as { response?: { data?: string } })?.response?.data?.substring(0, 200),
        status: (error as { response?: { status?: number } })?.response?.status,
      });
      return {
        success: false,
        requiresSMS: false,
        error: error instanceof Error ? error.message : 'Network error',
      };
    }
  }

  // Handle MFA verification for ESS portal
  async handleESSMFA(verificationCode: string): Promise<LoginResponse> {
    try {
      console.log('Submitting MFA verification to ESS portal...');

      // This would need to be implemented based on Costco's specific MFA flow
      const mfaData = {
        verificationCode: verificationCode,
        // Add other MFA-specific fields as needed
      };

      const response = await this.httpClient.post(
        APP_CONFIG.COSTCO_URLS.LOGIN, // Or specific MFA endpoint
        new URLSearchParams(mfaData),
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        },
      );

      const responseText = response.data;
      
      if (this.isESSLoginSuccessful(responseText)) {
        this.extractESSSession(response.headers['set-cookie']);
        return {
          success: true,
          requiresSMS: false,
          sessionToken: this.sessionToken || undefined,
        };
      }

      return {
        success: false,
        requiresSMS: false,
        error: 'Invalid verification code',
      };

    } catch (error) {
      console.error('ESS MFA verification failed:', error);
      return {
        success: false,
        requiresSMS: false,
        error: error instanceof Error ? error.message : 'MFA verification failed',
      };
    }
  }

  // Validate current ESS session
  async validateESSSession(): Promise<boolean> {
    try {
      if (!this.sessionToken && !this.f5SessionId) {
        return false;
      }

      // Test session by accessing the ESS portal
      const response = await this.httpClient.get(APP_CONFIG.COSTCO_URLS.BASE, {
        headers: this.getESSHeaders(),
      });

      // Check if we're still authenticated (not redirected to login)
      return !response.data.includes('BIG-IP can not find session information') &&
             !response.data.includes('username') &&
             !response.data.includes('password');
    } catch (error) {
      console.error('ESS session validation failed:', error);
      return false;
    }
  }

  // Extract F5 BIG-IP session information
  private extractF5Session(cookies: string[] | undefined): void {
    console.log('🍪 Extracting F5 session from cookies:', cookies);
    if (!cookies) {
      console.log('No cookies provided for F5 session extraction');
      return;
    }
    
    for (const cookie of cookies) {
      console.log('Checking cookie for F5 session:', cookie);
      // Look for F5 session cookies
      if (cookie.includes('BIGipServer') || cookie.includes('F5_')) {
        const match = cookie.match(/([^=]+)=([^;]+)/);
        if (match) {
          this.f5SessionId = match[2];
          console.log('✅ F5 session extracted:', match[1]);
          break;
        }
      }
    }
    
    if (!this.f5SessionId) {
      console.log('❌ No F5 session found in cookies');
    }
  }

  // Extract ESS session information
  private extractESSSession(cookies: string[] | undefined): void {
    console.log('🍪 Extracting ESS session from cookies:', cookies);
    if (!cookies) {
      console.log('No cookies provided for ESS session extraction');
      return;
    }
    
    for (const cookie of cookies) {
      console.log('Checking cookie for ESS session:', cookie);
      // Look for ESS session cookies
      if (cookie.includes('JSESSIONID') || cookie.includes('session') || cookie.includes('auth')) {
        const match = cookie.match(/([^=]+)=([^;]+)/);
        if (match) {
          this.sessionToken = match[2];
          console.log('✅ ESS session extracted:', match[1]);
          break;
        }
      }
    }
    
    if (!this.sessionToken) {
      console.log('❌ No ESS session found in cookies');
    }
  }

  // Extract ESS-specific form fields using regex
  private extractESSFormFields(html: string): Record<string, string> {
    const fields: Record<string, string> = {};
    
    // Use regex to find hidden input fields
    const hiddenInputRegex = /<input[^>]*type=["']hidden["'][^>]*>/gi;
    const matches = html.match(hiddenInputRegex);
    
    if (matches) {
      for (const match of matches) {
        const nameMatch = match.match(/name=["']([^"']+)["']/i);
        const valueMatch = match.match(/value=["']([^"']*)["']/i);
        
        if (nameMatch && valueMatch) {
          fields[nameMatch[1]] = valueMatch[1];
        }
      }
    }
    
    return fields;
  }

  // Check if ESS login was successful using string matching
  private isESSLoginSuccessful(responseText: string): boolean {
    const lowerResponse = responseText.toLowerCase();
    
    // Check for explicit failure indicators first
    const failureIndicators = [
      'logout page',
      'big-ip logout',
      'session expired',
      'authentication failed',
      'invalid credentials',
      'access denied',
      'unauthorized',
    ];
    
    const hasFailureIndicator = failureIndicators.some(indicator => 
      lowerResponse.includes(indicator),
    );
    
    if (hasFailureIndicator) {
      console.log('❌ Failure indicator detected:', failureIndicators.find(indicator => 
        lowerResponse.includes(indicator),
      ));
      return false;
    }
    
    // Check for login form presence (indicates we're still on login page)
    const hasLoginForm = (lowerResponse.includes('username') || lowerResponse.includes('user name')) && 
                        (lowerResponse.includes('password') || lowerResponse.includes('pwd')) &&
                        (lowerResponse.includes('login') || lowerResponse.includes('sign in'));
    
    if (hasLoginForm) {
      console.log('❌ Login form still present - authentication not completed');
      return false;
    }
    
    // ESS success indicators (only if no failure indicators)
    const successIndicators = [
      'welcome',
      'dashboard',
      'employee portal',
      'my schedule',
      'home page',
      'main menu',
    ];
    
    const hasSuccessIndicator = successIndicators.some(indicator => 
      lowerResponse.includes(indicator),
    );
    
    console.log('Success indicators found:', successIndicators.filter(indicator => 
      lowerResponse.includes(indicator),
    ));
    
    return hasSuccessIndicator;
  }

  // Check if MFA is required using string matching
  private requiresMFA(responseText: string): boolean {
    const lowerResponse = responseText.toLowerCase();
    
    // Don't detect MFA on logout pages or error pages
    const isLogoutOrError = lowerResponse.includes('logout page') || 
                           lowerResponse.includes('big-ip logout') ||
                           lowerResponse.includes('session expired') ||
                           lowerResponse.includes('authentication failed');
    
    if (isLogoutOrError) {
      console.log('❌ Not checking MFA on logout/error page');
      return false;
    }
    
    const mfaIndicators = [
      'verification code',
      'enter code',
      'sms code',
      'text message',
      'authentication code',
      'two-factor',
      '2fa',
      'mfa',
    ];
    
    const hasMFAIndicator = mfaIndicators.some(indicator => lowerResponse.includes(indicator));
    
    if (hasMFAIndicator) {
      console.log('🔐 MFA indicator found:', mfaIndicators.find(indicator => 
        lowerResponse.includes(indicator),
      ));
    }
    
    return hasMFAIndicator;
  }

  // Extract ESS error messages using regex
  private extractESSError(html: string): string | null {
    // Handle BIG-IP specific messages first
    if (html.includes('BIG-IP can not find session information')) {
      return 'Session expired. Please try logging in again.';
    }
    
    if (html.includes('To open a new session, please')) {
      return 'Session could not be established. Please try again or contact IT support.';
    }
    
    // Common error patterns
    const errorPatterns = [
      // Look for complete sentences in error divs/spans
      /<div[^>]*class="[^"]*error[^"]*"[^>]*>([^<]+(?:<[^>]*>[^<]*<\/[^>]*>[^<]*)*)<\/div>/i,
      /<span[^>]*class="[^"]*error[^"]*"[^>]*>([^<]+(?:<[^>]*>[^<]*<\/[^>]*>[^<]*)*)<\/span>/i,
      /<p[^>]*class="[^"]*error[^"]*"[^>]*>([^<]+(?:<[^>]*>[^<]*<\/[^>]*>[^<]*)*)<\/p>/i,
      
      // Look for error messages in text
      /error[^:]*:\s*([^<\n.!?]+[.!?])/i,
      /invalid[^:]*:\s*([^<\n.!?]+[.!?])/i,
      /failed[^:]*:\s*([^<\n.!?]+[.!?])/i,
      
      // Look for authentication specific messages
      /authentication\s+failed[^<\n.!?]*[.!?]/i,
      /invalid\s+credentials[^<\n.!?]*[.!?]/i,
      /access\s+denied[^<\n.!?]*[.!?]/i,
    ];
    
    for (const pattern of errorPatterns) {
      const match = html.match(pattern);
      if (match && match[1]) {
        const errorText = match[1].trim();
        // Clean up HTML entities and extra whitespace
        const cleanError = errorText
          .replace(/&nbsp;/g, ' ')
          .replace(/&amp;/g, '&')
          .replace(/&lt;/g, '<')
          .replace(/&gt;/g, '>')
          .replace(/&quot;/g, '"')
          .replace(/\s+/g, ' ')
          .trim();
        
        if (cleanError.length > 5) { // Only return meaningful errors
          return cleanError;
        }
      }
    }
    
    // If no specific error found but it's clearly a logout/error page
    if (html.toLowerCase().includes('logout page')) {
      return 'Authentication failed. Please check your credentials and try again.';
    }
    
    return null;
  }

  // Get headers for ESS requests
  private getESSHeaders(): Record<string, string> {
    const headers: Record<string, string> = {
      'User-Agent': this.currentUserAgent,
      'Referer': APP_CONFIG.COSTCO_URLS.BASE,
    };
    
    // Add session cookies if available
    const cookies: string[] = [];
    if (this.f5SessionId) {
      cookies.push(`F5_SESSION=${this.f5SessionId}`);
    }
    if (this.sessionToken) {
      cookies.push(`JSESSIONID=${this.sessionToken}`);
    }
    
    if (cookies.length > 0) {
      headers['Cookie'] = cookies.join('; ');
    }
    
    return headers;
  }

  // Handle SAML authentication flow
  private async handleSAMLFlow(responseText: string, formFields: Record<string, string>): Promise<LoginResponse> {
    try {
      console.log('🔄 Processing SAML authentication flow...');
      
      // Extract SAML request from the response
      const samlRequest = formFields.SAMLRequest;
      if (!samlRequest) {
        console.log('❌ No SAML request found in form fields');
        return {
          success: false,
          requiresSMS: false,
          error: 'SAML authentication failed - no SAML request found',
        };
      }
      
      console.log('📋 SAML Request found, length:', samlRequest.length);
      
      // Look for the SAML destination URL
      const destinationMatch = responseText.match(/action=["']([^"']+)["']/i);
      const destination = destinationMatch ? destinationMatch[1] : 'https://login.costco.com/idp/SSO.saml2';
      
      console.log('🎯 SAML Destination:', destination);
      
      // This is where we would need to implement the full SAML flow
      // For now, return an informative error
      return {
        success: false,
        requiresSMS: false,
        error: 'SAML authentication detected. This requires additional implementation to handle Costco\'s SSO flow.',
      };
      
    } catch (error) {
      console.error('SAML flow handling failed:', error);
      return {
        success: false,
        requiresSMS: false,
        error: 'SAML authentication flow failed',
      };
    }
  }
} 