import { Platform } from 'react-native';
import { UserCredentials, LoginResponse, AuthResult } from '../types';
import { APP_CONFIG } from '../constants';
import StorageService from './StorageService';
import { RateLimitedHttpClient } from './RateLimitedHttpClient';

export class AuthService {
  private static instance: AuthService;
  private httpClient: RateLimitedHttpClient;
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

    // Use the rate-limited HTTP client
    this.httpClient = RateLimitedHttpClient.getInstance();

    this.storageService = StorageService;
  }

  public static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  /**
   * Attempt to authenticate with corporate ESS portal
   * 
   * AUTHENTICATION FLOW DOCUMENTATION:
   * 1. POST credentials to corporate portal
   * 2. Server responds with SAML redirect to identity provider
   * 3. SAML SSO redirects to authenticator for 2FA
   * 4. User receives SMS code and enters it on the 2FA page
   * 5. After 2FA success, redirects back to corporate portal
   * 6. User navigates to "Online Employee Schedules" tab
   * 7. Redirects to BI system for schedule reports
   * 8. User selects week from dropdown and clicks "Run" to get schedule
   */
  public async login(credentials: UserCredentials): Promise<AuthResult> {
    try {
      console.log('🎯 [LOGIN] Starting corporate portal authentication');
      console.log('👤 [LOGIN] Employee ID:', credentials.employeeId.substring(0, 3) + '***');
      
      // Web platform troubleshooting mode
      if (Platform.OS === 'web') {
        console.log('🌐 [LOGIN] Web platform detected - entering troubleshooting mode');
        return await this.webDebugLogin(credentials);
      }

      // Validate credentials
      if (!credentials.employeeId || !credentials.password) {
        console.log('❌ [LOGIN] Missing credentials');
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
        console.log('🔐 [LOGIN] MFA required - switching to SMS verification');
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
        console.log('💾 [LOGIN] Saving credentials for future use');
        await this.saveCredentials(credentials);
      }

      console.log('✅ [LOGIN] Authentication completed successfully');
      return {
        success: true,
        sessionData: initialResult.sessionData,
      };

    } catch (error) {
      console.error('💥 [ERROR] Authentication exception:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown authentication error',
      };
    }
  }

  /**
   * Web platform debug login - provides detailed troubleshooting info
   * Since web runs in browser, no WebView available, but user can inspect network directly
   */
  private async webDebugLogin(credentials: UserCredentials): Promise<AuthResult> {
    console.log('🌐 [WEB DEBUG] Starting web platform authentication troubleshooting');
    console.log('👤 [WEB DEBUG] Employee ID:', credentials.employeeId.substring(0, 3) + '***');
    
    // Validate credentials
    if (!credentials.employeeId || !credentials.password) {
      return {
        success: false,
        error: 'Employee ID and password are required',
      };
    }

    try {
      // On web, we can't use WebView, but we can try direct API calls with detailed logging
      const loginUrl = APP_CONFIG.PORTAL_URLS.LOGIN;
      
      console.log('🔍 [WEB DEBUG] Testing connectivity to:', loginUrl);
      console.log('🛠️ [WEB DEBUG] CORS may block this request - check browser console for details');
      console.log('💡 [WEB DEBUG] Open browser dev tools (F12) -> Network tab to see actual requests');
      
      // Try a simple fetch to test connectivity and CORS
      const response = await fetch(loginUrl, {
        method: 'GET',
        mode: 'cors',
        credentials: 'include',
        headers: {
          'User-Agent': this.currentUserAgent,
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        },
      });

      console.log('✅ [WEB DEBUG] Initial connectivity test successful');
      console.log('📊 [WEB DEBUG] Response status:', response.status);
      console.log('🔗 [WEB DEBUG] Response URL:', response.url);
      
      const responseText = await response.text();
      console.log('📄 [WEB DEBUG] Response length:', responseText.length);
      
      // Check if login form is present
      const hasLoginForm = responseText.toLowerCase().includes('<form') && 
                          (responseText.toLowerCase().includes('password') || 
                           responseText.toLowerCase().includes('username'));
      
      console.log('🔍 [WEB DEBUG] Has login form:', hasLoginForm);
      
      if (hasLoginForm) {
        return {
          success: false,
          error: `Web Troubleshooting Mode Active 🌐

DIAGNOSIS:
✅ Connection to ${APP_CONFIG.PORTAL_URLS.BASE} successful
✅ Login page loaded (${responseText.length} chars)
✅ Login form detected

NEXT STEPS:
1. Open browser dev tools (F12)
2. Go to Network tab
3. Try manual login at ${loginUrl}
4. Watch for failed requests or CORS errors
5. Check if username/password validation occurs client-side or server-side

RECOMMENDATION:
For production use, deploy mobile app where WebView authentication works properly.`,
          sessionData: { 
            hasForm: hasLoginForm,
            responseLength: responseText.length,
            responseUrl: response.url,
            troubleshootingMode: true, 
          },
        };
      } else {
        return {
          success: false,
          error: `Web Troubleshooting Mode Active 🌐

DIAGNOSIS:
✅ Connection successful 
❌ No login form detected

This might indicate:
- Already authenticated session
- Redirect to different login page
- Page structure changed

Check browser dev tools for more details.`,
        };
      }

    } catch (error) {
      console.error('❌ [WEB DEBUG] Connection failed:', error);
      
      const isNetworkError = error instanceof TypeError && error.message.includes('Failed to fetch');
      const isCORSError = error instanceof TypeError && 
                         (error.message.includes('CORS') || error.message.includes('cross-origin'));
      
      let errorMessage = `Web Troubleshooting Mode Active 🌐

DIAGNOSIS:
❌ Connection failed: ${error instanceof Error ? error.message : 'Unknown error'}

`;

      if (isCORSError || isNetworkError) {
        errorMessage += `
LIKELY CAUSE: CORS (Cross-Origin Resource Sharing) restriction

SOLUTIONS:
1. Use mobile app (recommended)
2. Disable CORS in browser (DEV ONLY):
   - Chrome: --disable-web-security --user-data-dir=/tmp/chrome
   - Firefox: about:config -> security.tls.insecure_fallback_hosts
3. Use browser extension to disable CORS
4. Access from company network that allows CORS

TECHNICAL: Corporate portals often block cross-origin requests for security.`;
      }

      return {
        success: false,
        error: errorMessage,
      };
    }
  }

  /**
   * Attempt initial login to ESS portal
   */
  private async attemptESSLogin(credentials: UserCredentials): Promise<AuthResult> {
    try {
      const loginUrl = APP_CONFIG.PORTAL_URLS.LOGIN;
      
      console.log('🚀 [AUTH FLOW] Starting login attempt');
      console.log('📍 [URL] POST:', loginUrl);
      
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
          'Origin': APP_CONFIG.PORTAL_URLS.BASE,
          'Referer': APP_CONFIG.PORTAL_URLS.LOGIN,
          'Upgrade-Insecure-Requests': '1',
        },
        body: loginData,
        redirect: 'manual', // Don't follow redirects automatically
      });

      const responseText = await response.text();
      const responseUrl = response.url;

      console.log('📊 [RESPONSE] Status:', response.status);
      console.log('📍 [URL] Response:', responseUrl);
      console.log('🔗 [REDIRECT] Location:', response.headers.get('Location') || 'None');
      
      // Log key response characteristics without overwhelming detail
      const responseLength = responseText.length;
      const hasForm = responseText.toLowerCase().includes('<form');
      const hasScript = responseText.toLowerCase().includes('<script');
      console.log('📄 [CONTENT] Length:', responseLength, 'HasForm:', hasForm, 'HasScript:', hasScript);

      // DEBUG: If we're at an intermediate page, let's see what forms are available
      if (responseUrl.includes('/my.policy') || responseUrl.includes('policy')) {
        console.log('🔍 [DEBUG] Policy/intermediate page detected');
        this.logFormDetails(responseText);
      }

      // DEBUG: If we have a short response, log more details
      if (responseLength < 2000) {
        console.log('🔍 [DEBUG] Short response - logging first 500 chars:');
        console.log(responseText.substring(0, 500));
      }

      // Check for various response patterns
      if (this.isLogoutPage(responseText)) {
        console.log('❌ [AUTH] Logout/error page detected');
        return {
          success: false,
          error: 'Login failed: Invalid credentials or session expired',
        };
      }

      // Handle intermediate pages (like policy acceptance)
      if (this.isIntermediatePage(responseText, responseUrl)) {
        console.log('📋 [AUTH] Intermediate page detected - attempting to continue');
        const continueResult = await this.handleIntermediatePage(responseText, responseUrl);
        if (continueResult) {
          return continueResult;
        }
      }

      if (this.isSAMLRedirect(responseText, responseUrl)) {
        console.log('🔄 [AUTH] SAML/PingOne redirect detected');
        return {
          success: false,
          requiresMFA: true,
          mfaMethod: 'sms',
          error: 'SAML SSO redirect detected',
          sessionData: { responseText, responseUrl },
        };
      }

      if (this.isSuccessfulLogin(responseText, responseUrl)) {
        console.log('✅ [AUTH] Successful login detected');
        return {
          success: true,
          sessionData: { responseText, responseUrl },
        };
      }

      // Extract any error messages
      const errorMessage = this.extractErrorMessage(responseText);
      console.log('❌ [AUTH] Login failed:', errorMessage || 'Unknown error');
      
      return {
        success: false,
        error: errorMessage || 'Unknown login error',
      };

    } catch (error) {
      console.error('💥 [ERROR] ESS login exception:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Network error during login',
      };
    }
  }

  /**
   * Check if response indicates a logout page or session error
   */
  private isLogoutPage(html: string): boolean {
    const logoutIndicators = [
      'BIG-IP logout page',
      'big-ip can not find session information',
      'your session could not be established',
      'session expired',
      'logged out',
      'session has been terminated',
      'cookies are disabled in your browser',
      'f5 networks', // F5 load balancer error pages
    ];
    
    const lowerHtml = html.toLowerCase();
    return logoutIndicators.some(indicator => lowerHtml.includes(indicator));
  }

  /**
   * Enhanced SAML redirect detection with PingOne specifics
   */
  private isSAMLRedirect(html: string, url: string): boolean {
    const lowerHtml = html.toLowerCase();
    const lowerUrl = url.toLowerCase();
    
    // PingOne specific indicators (most reliable)
    const pingOneIndicators = [
      'authenticator.pingone.com',
      'pingid',
      'ping identity',
      'pingone',
    ];
    
    // SAML indicators in content
    const samlContentIndicators = [
      'samlrequest',
      'saml2',
      'sso.saml',
      'idp/sso',
      'shibboleth',
      'federation',
    ];
    
    // SAML indicators in URL
    const samlUrlIndicators = [
      'login.costco.com',
      'sso.costco.com',
      'idp.costco.com',
      'saml',
      'sso',
    ];
    
    // Check for PingOne (most specific)
    const hasPingOneIndicator = pingOneIndicators.some(indicator => 
      lowerHtml.includes(indicator) || lowerUrl.includes(indicator),
    );
    
    // Check content
    const hasContentIndicator = samlContentIndicators.some(indicator => 
      lowerHtml.includes(indicator),
    );
    
    // Check URL
    const hasUrlIndicator = samlUrlIndicators.some(indicator => 
      lowerUrl.includes(indicator),
    );
    
    // Check for SAML form elements
    const hasSamlForm = lowerHtml.includes('<form') && (
      lowerHtml.includes('samlrequest') || 
      lowerHtml.includes('samlresponse') ||
      lowerHtml.includes('action="') && (
        lowerHtml.includes('sso') || 
        lowerHtml.includes('saml') ||
        lowerHtml.includes('pingone')
      )
    );
    
    const isSamlRedirect = hasPingOneIndicator || hasContentIndicator || hasUrlIndicator || hasSamlForm;
    
    if (isSamlRedirect) {
      console.log('🔍 [DETECTION] SAML/PingOne redirect confirmed');
      console.log('🎯 [INDICATORS] Found:', {
        pingOne: hasPingOneIndicator,
        content: hasContentIndicator,
        url: hasUrlIndicator,
        form: hasSamlForm,
      });
      console.log('📍 [TARGET URL]:', url.substring(0, 50) + (url.length > 50 ? '...' : ''));
    }
    
    return isSamlRedirect;
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
  public async saveCredentials(credentials: UserCredentials): Promise<void> {
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
   * Enhanced MFA detection with PingOne SMS patterns
   */
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
    
    // PingOne specific MFA indicators (most reliable)
    const pingOneMfaIndicators = [
      'sms sent to mobile',
      'enter the passcode you received',
      'resend passcode',
      'costco will never ask for your password',
      'pingid',
      'ping identity mfa',
    ];
    
    // General MFA indicators
    const generalMfaIndicators = [
      // SMS/Text message indicators
      'verification code',
      'enter code',
      'sms code',
      'text message',
      'authentication code',
      'mobile code',
      'phone code',
      
      // General MFA indicators
      'two-factor',
      '2fa',
      'mfa',
      'multi-factor',
      'second factor',
      
      // Form indicators
      'enter the code',
      'verification',
      'passcode',
      'security code',
    ];
    
    // Check PingOne specific patterns first (higher confidence)
    const foundPingOneIndicators = pingOneMfaIndicators.filter(indicator => 
      lowerResponse.includes(indicator),
    );
    
    // Check general patterns
    const foundGeneralIndicators = generalMfaIndicators.filter(indicator => 
      lowerResponse.includes(indicator),
    );
    
    const foundAnyIndicators = foundPingOneIndicators.length > 0 || foundGeneralIndicators.length > 0;
    
    if (foundAnyIndicators) {
      console.log('🔍 [DETECTION] MFA indicators confirmed');
      if (foundPingOneIndicators.length > 0) {
        console.log('🎯 [PINGONE MFA]:', foundPingOneIndicators);
      }
      if (foundGeneralIndicators.length > 0) {
        console.log('🎯 [GENERAL MFA]:', foundGeneralIndicators);
      }
      return true;
    }
    
    return false;
  }

  /**
   * Enhanced SAML flow handling with better data extraction
   */
  private async handleSAMLFlow(responseText: string, formFields: Record<string, string>): Promise<LoginResponse> {
    try {
      console.log('🔄 Processing SAML authentication flow...');
      
      // Extract SAML request from the response
      const samlRequest = this.extractSAMLRequest(responseText, formFields);
      if (!samlRequest) {
        console.log('❌ No SAML request found in response');
        return {
          success: false,
          requiresSMS: false,
          error: 'SAML authentication failed - no SAML request found',
          errorType: 'SAML_REQUIRED',
        };
      }
      
      console.log('📋 SAML Request found, preparing to follow redirect...');
      
      // Extract destination URL
      const destination = this.extractSAMLDestination(responseText);
      console.log('🎯 SAML Destination:', destination);
      
      // Extract relay state if present
      const relayState = this.extractRelayState(responseText, formFields);
      if (relayState) {
        console.log('🔗 RelayState found:', relayState.substring(0, 50) + '...');
      }
      
      // For now, we'll return a helpful message to guide the user
      // In the future, we could attempt to automate this flow
      return {
        success: false,
        requiresSMS: false,
        error: 'SAML Single Sign-On detected. Please complete authentication manually in your browser, then return to enter your MFA code.',
        errorType: 'SAML_REQUIRED',
      };
      
    } catch (error: unknown) {
      console.error('SAML flow handling failed:', error);
      return {
        success: false,
        requiresSMS: false,
        error: 'SAML authentication flow failed',
        errorType: 'SAML_REQUIRED',
      };
    }
  }

  /**
   * Extract SAML request from HTML response
   */
  private extractSAMLRequest(html: string, formFields: Record<string, string>): string | null {
    // First check form fields
    if (formFields.SAMLRequest) {
      return formFields.SAMLRequest;
    }
    
    // Look for SAML request in various formats
    const samlPatterns = [
      /name=["']SAMLRequest["'][^>]*value=["']([^"']+)["']/i,
      /value=["']([^"']*)['"]\s*name=["']SAMLRequest["']/i,
      /<input[^>]*SAMLRequest[^>]*value=["']([^"']+)["']/i,
      /SAMLRequest[^>]*=\s*["']([^"']+)["']/i,
    ];
    
    for (const pattern of samlPatterns) {
      const match = html.match(pattern);
      if (match && match[1]) {
        return match[1];
      }
    }
    
    return null;
  }

  /**
   * Extract SAML destination URL
   */
  private extractSAMLDestination(html: string): string {
    // Look for form action URLs
    const actionPatterns = [
      /action=["']([^"']+)["']/i,
      /form[^>]*action=["']([^"']+)["']/i,
    ];
    
    for (const pattern of actionPatterns) {
      const match = html.match(pattern);
      if (match && match[1]) {
        // Decode HTML entities
        return match[1].replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>');
      }
    }
    
    // Default SAML endpoints
    return 'https://login.costco.com/idp/SSO.saml2';
  }

  /**
   * Extract RelayState from response
   */
  private extractRelayState(html: string, formFields: Record<string, string>): string | null {
    // First check form fields
    if (formFields.RelayState) {
      return formFields.RelayState;
    }
    
    // Look for RelayState in HTML
    const relayPatterns = [
      /name=["']RelayState["'][^>]*value=["']([^"']+)["']/i,
      /value=["']([^"']*)['"]\s*name=["']RelayState["']/i,
    ];
    
    for (const pattern of relayPatterns) {
      const match = html.match(pattern);
      if (match && match[1]) {
        return match[1];
      }
    }
    
    return null;
  }

  /**
   * Handle MFA code verification with enhanced error handling
   */
  public async verifyMFACode(code: string, sessionData?: Record<string, unknown>): Promise<AuthResult> {
    try {
      console.log('🔐 [MFA FLOW] Starting MFA verification');
      console.log('📱 [MFA] Code length:', code.length);
      
      if (!code || code.length < 4) {
        console.log('❌ [MFA] Invalid code format');
        return {
          success: false,
          error: 'Please enter a valid verification code',
          errorType: 'INVALID_CREDENTIALS',
        };
      }
      
      console.log('✅ [MFA] Code format validation passed');
      console.log('📡 [MFA] Would verify code with PingOne server (rate-limited)');
      
      // This would be the actual MFA verification endpoint
      // For now, we'll simulate the process
      if (sessionData) {
        console.log('📋 [MFA] Session data available:', Object.keys(sessionData));
      } else {
        console.log('⚠️ [MFA] No session data provided');
      }
      
      // In real implementation, this would:
      // 1. POST the MFA code to the PingOne verification endpoint
      // 2. Handle the response 
      // 3. Extract final session tokens
      // 4. Navigate to the main portal
      
      console.log('🚧 [MFA] MFA verification endpoint needs implementation');
      
      return {
        success: false,
        error: 'MFA verification endpoint needs to be implemented based on the actual SAML flow',
        errorType: 'MFA_REQUIRED',
      };
      
    } catch (error: unknown) {
      console.error('💥 [ERROR] MFA verification exception:', error instanceof Error ? error.message : 'Unknown error');
      
      return {
        success: false,
        error: error instanceof Error ? error.message : 'MFA verification failed',
        errorType: 'MFA_REQUIRED',
      };
    }
  }

  /**
   * Log form details for debugging intermediate pages
   */
  private logFormDetails(responseText: string) {
    try {
      // Find form actions
      const actionMatches = responseText.match(/action=["']([^"']+)["']/gi);
      if (actionMatches) {
        console.log('🎯 [DEBUG] Form actions found:', actionMatches.map(m => m.replace(/action=["']/i, '').replace(/["']/, '')));
      }
      
      // Find input fields
      const inputMatches = responseText.match(/<input[^>]*name=["']([^"']+)["'][^>]*>/gi);
      if (inputMatches) {
        const inputNames = inputMatches.map(match => {
          const nameMatch = match.match(/name=["']([^"']+)["']/i);
          const typeMatch = match.match(/type=["']([^"']+)["']/i);
          const valueMatch = match.match(/value=["']([^"']+)["']/i);
          return {
            name: nameMatch ? nameMatch[1] : 'unknown',
            type: typeMatch ? typeMatch[1] : 'text',
            hasValue: !!valueMatch,
          };
        });
        console.log('📝 [DEBUG] Input fields:', inputNames);
      }
      
      // Find submit buttons
      const submitMatches = responseText.match(/<input[^>]*type=["']submit["'][^>]*>|<button[^>]*type=["']submit["'][^>]*>/gi);
      if (submitMatches) {
        console.log('🔘 [DEBUG] Submit buttons found:', submitMatches.length);
      }
      
      // Check for redirects or meta refresh
      const metaRefresh = responseText.match(/<meta[^>]*http-equiv=["']refresh["'][^>]*>/gi);
      if (metaRefresh) {
        console.log('🔄 [DEBUG] Meta refresh detected:', metaRefresh);
      }
      
    } catch (error) {
      console.log('❌ [DEBUG] Error parsing form details:', error);
    }
  }

  /**
   * Check if response indicates an intermediate page
   */
  private isIntermediatePage(responseText: string, responseUrl: string): boolean {
    const lowerText = responseText.toLowerCase();
    const lowerUrl = responseUrl.toLowerCase();
    
    // Check for policy/terms pages
    const isPolicy = lowerUrl.includes('/my.policy') || 
                    lowerUrl.includes('policy') || 
                    lowerText.includes('terms of use') ||
                    lowerText.includes('acceptable use policy') ||
                    lowerText.includes('user agreement');
    
    // Check for pages that have continue/accept buttons
    const hasContinueForm = lowerText.includes('continue') && lowerText.includes('<form');
    const hasAcceptButton = lowerText.includes('accept') || lowerText.includes('agree');
    
    return isPolicy || (hasContinueForm && hasAcceptButton);
  }

  /**
   * Handle intermediate page and continue the authentication flow
   */
  private async handleIntermediatePage(responseText: string, responseUrl: string): Promise<AuthResult | null> {
    try {
      console.log('🔄 [INTERMEDIATE] Processing intermediate page:', responseUrl);
      
      // Extract form data from the intermediate page
      const formData = this.extractFormData(responseText);
      if (!formData.action) {
        console.log('❌ [INTERMEDIATE] No form action found');
        return null;
      }
      
      console.log('📝 [INTERMEDIATE] Submitting form to:', formData.action);
      console.log('📋 [INTERMEDIATE] Form fields:', Object.keys(formData.fields));
      
      // Submit the form to continue
      const formBody = new URLSearchParams();
      Object.entries(formData.fields).forEach(([key, value]) => {
        formBody.append(key, value as string);
      });
      
      const response = await this.httpClient.post(formData.action, formBody, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Referer': responseUrl,
        },
      });
      
      const newResponseText = response.data;
      const newResponseUrl = response.request?.responseURL || formData.action;
      
      console.log('📊 [INTERMEDIATE] Continue response status:', response.status);
      console.log('📍 [INTERMEDIATE] Continue response URL:', newResponseUrl);
      
      // Check if we reached PingOne now
      if (newResponseUrl.includes('authenticator.pingone.com')) {
        console.log('✅ [INTERMEDIATE] Successfully reached PingOne!');
        return {
          success: false,
          requiresMFA: true,
          mfaMethod: 'sms',
          error: 'PingOne authentication page reached - SMS should be sent to your phone',
          sessionData: { responseText: newResponseText, responseUrl: newResponseUrl },
        };
      }
      
      // Check if we got blocked by CAPTCHA
      if (this.isCaptchaBlocked(newResponseText)) {
        console.log('🤖 [INTERMEDIATE] CAPTCHA challenge detected at SAML endpoint');
        return {
          success: false,
          requiresMFA: false,
          error: 'CAPTCHA challenge detected. The server is blocking automated authentication. Please try logging in manually through your browser first, then return to the app.',
          errorType: 'CAPTCHA_REQUIRED',
        };
      }
      
      // Check if we need to handle another intermediate step
      if (this.isIntermediatePage(newResponseText, newResponseUrl)) {
        console.log('🔄 [INTERMEDIATE] Another intermediate page - recursing');
        return await this.handleIntermediatePage(newResponseText, newResponseUrl);
      }
      
      return null;
      
    } catch (error) {
      console.error('💥 [INTERMEDIATE] Error handling intermediate page:', error);
      return null;
    }
  }

  /**
   * Extract form data from HTML response
   */
  private extractFormData(html: string): { action: string; fields: Record<string, string> } {
    const formData = { action: '', fields: {} as Record<string, string> };
    
    try {
      // Extract form action
      const actionMatch = html.match(/<form[^>]*action=["']([^"']+)["']/i);
      if (actionMatch) {
        formData.action = actionMatch[1];
        // Handle relative URLs
        if (formData.action.startsWith('/')) {
          formData.action = APP_CONFIG.PORTAL_URLS.BASE + formData.action;
        }
      }
      
      // Extract input fields with values
      const inputMatches = html.match(/<input[^>]*>/gi) || [];
      for (const inputMatch of inputMatches) {
        const nameMatch = inputMatch.match(/name=["']([^"']+)["']/i);
        const valueMatch = inputMatch.match(/value=["']([^"']+)["']/i);
        const typeMatch = inputMatch.match(/type=["']([^"']+)["']/i);
        
        if (nameMatch) {
          const name = nameMatch[1];
          const value = valueMatch ? valueMatch[1] : '';
          const type = typeMatch ? typeMatch[1].toLowerCase() : 'text';
          
          // Include hidden fields and submit buttons, skip password/text fields
          if (type === 'hidden' || type === 'submit' || (value && type !== 'password' && type !== 'text')) {
            formData.fields[name] = value;
          }
        }
      }
      
    } catch (error) {
      console.error('❌ [FORM] Error extracting form data:', error);
    }
    
    return formData;
  }

  private isCaptchaBlocked(responseText: string): boolean {
    const lowerText = responseText.toLowerCase();
    
    // Common CAPTCHA indicators
    const captchaIndicators = [
      'captcha',
      'recaptcha',
      'verify you are human',
      'prove you are human',
      'security check',
      'verify your identity',
      'please complete the security challenge',
      'robot verification',
      'human verification',
      'verify that you are not a robot',
      'hcaptcha',
    ];
    
    return captchaIndicators.some(indicator => lowerText.includes(indicator));
  }

  /**
   * Store WebView session data for use with HTTP client
   */
  public async storeWebViewSession(cookies?: string, sessionInfo?: Record<string, unknown>): Promise<void> {
    try {
      console.log('💾 [SESSION] Storing WebView authentication session');
      
      if (cookies && cookies.length > 0) {
        console.log('🍪 [SESSION] Storing cookies:', cookies.length, 'characters');
        console.log('🔍 [SESSION] Cookie preview:', cookies.substring(0, 100) + '...');
        
        // Update HTTP client headers with cookies
        this.httpClient.updateHeaders({
          'Cookie': cookies,
        });
        console.log('🍪 [SESSION] Updated HTTP client with session cookies');
      }
      
      // Store session data
      this.sessionData = {
        authenticated: true,
        authMethod: 'webview',
        timestamp: Date.now(),
        cookies: cookies,
        cookieLength: cookies?.length || 0,
        ...sessionInfo,
      };
      
      console.log('✅ [SESSION] WebView session stored successfully');
      console.log('📊 [SESSION] Session data keys:', Object.keys(this.sessionData));
      
    } catch (error) {
      console.error('❌ [SESSION] Failed to store WebView session:', error);
    }
  }

  /**
   * Test if the stored session can access authenticated endpoints
   */
  public async testAuthenticatedAccess(): Promise<boolean> {
    try {
      console.log('🧪 [SESSION] Testing authenticated access to portal');
      
      if (!this.sessionData) {
        console.log('❌ [SESSION] No session data available');
        return false;
      }
      
      console.log('📋 [SESSION] Current session age:', Math.round((Date.now() - (this.sessionData.timestamp as number)) / 1000), 'seconds');
      console.log('🍪 [SESSION] Using cookies length:', this.sessionData.cookieLength || 0);
      
      // Test access to the main portal with enhanced request headers
      const response = await this.httpClient.get(APP_CONFIG.PORTAL_URLS.PORTAL_MAIN, {
        headers: {
          'User-Agent': this.currentUserAgent,
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
          'Accept-Language': 'en-US,en;q=0.5',
          'Accept-Encoding': 'gzip, deflate, br',
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache',
        },
      });
      
      console.log('📊 [SESSION] Test response status:', response.status);
      const responseUrl = response.request?.responseURL || response.config?.url || 'Unknown';
      console.log('📍 [SESSION] Test response URL:', responseUrl);
      
      // Enhanced authentication check
      const isAuthenticated = this.checkAuthenticatedResponse(response, responseUrl);
      
      if (isAuthenticated) {
        console.log('✅ [SESSION] Authenticated access confirmed!');
        
        // Update session with successful test
        this.sessionData.lastSuccessfulTest = Date.now();
        this.sessionData.confirmedAccess = true;
        
        return true;
      } else {
        console.log('❌ [SESSION] Authentication session expired or invalid');
        console.log('🔍 [SESSION] Response indicates redirect to:', responseUrl);
        return false;
      }
      
    } catch (error) {
      console.error('❌ [SESSION] Error testing authenticated access:', error);
      return false;
    }
  }
  
  /**
   * Enhanced check for authenticated response
   */
  private checkAuthenticatedResponse(response: { status: number; data?: string; request?: { responseURL?: string }; config?: { url?: string } }, responseUrl: string): boolean {
    // Check status code
    if (response.status !== 200) {
      console.log('❌ [SESSION] Non-200 response:', response.status);
      return false;
    }
    
    // Check if redirected to login/policy pages
    const redirectsToAuth = responseUrl.includes('my.policy') || 
                           responseUrl.includes('login') ||
                           responseUrl.includes('/idp/') ||
                           responseUrl.includes('authenticator');
    
    if (redirectsToAuth) {
      console.log('❌ [SESSION] Redirected to authentication page');
      return false;
    }
    
    // Check if we're on the main portal
    const isPortalPage = responseUrl.includes('irj/portal/external');
    
    if (!isPortalPage) {
      console.log('❌ [SESSION] Not on portal page, URL:', responseUrl);
      return false;
    }
    
    // Check response content if available
    if (response.data && typeof response.data === 'string') {
      const content = response.data.toLowerCase();
      
      // Look for positive indicators
      const positiveIndicators = [
        'employee self service',
        'online employee schedules',
        'timesheet',
        'schedule',
        'payroll',
      ];
      
      const hasPositiveIndicator = positiveIndicators.some(indicator => 
        content.includes(indicator),
      );
      
      // Look for negative indicators
      const negativeIndicators = [
        'session expired',
        'login required',
        'unauthorized',
        'access denied',
        'authentication failed',
      ];
      
      const hasNegativeIndicator = negativeIndicators.some(indicator => 
        content.includes(indicator),
      );
      
      console.log('🔍 [SESSION] Content analysis:', {
        hasPositive: hasPositiveIndicator,
        hasNegative: hasNegativeIndicator,
        contentLength: content.length,
      });
      
      if (hasNegativeIndicator) {
        return false;
      }
      
      if (hasPositiveIndicator) {
        console.log('✅ [SESSION] Positive content indicators found');
        return true;
      }
    }
    
    // If we reach here, we're on the portal page with 200 status and no negative indicators
    console.log('✅ [SESSION] Portal access confirmed (basic check)');
    return true;
  }

  /**
   * Make an authenticated HTTP request using the stored session
   */
  public async makeAuthenticatedRequest(url: string, options?: { method?: string; headers?: Record<string, string> }): Promise<{ ok: boolean; status: number; text: () => Promise<string> }> {
    try {
      console.log('🌐 [AUTH] Making authenticated request to:', url);
      
      if (!this.sessionData) {
        throw new Error('No authenticated session available');
      }
      
      const method = options?.method || 'GET';
      const additionalHeaders = options?.headers || {};
      
      const requestHeaders = {
        'User-Agent': this.currentUserAgent,
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
        'Accept-Encoding': 'gzip, deflate, br',
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache',
        ...additionalHeaders,
      };
      
      if (method.toLowerCase() === 'get') {
        const response = await this.httpClient.get(url, { headers: requestHeaders });
        
        // Return simplified response object
        return {
          ok: response.status >= 200 && response.status < 300,
          status: response.status,
          text: async () => response.data,
        };
      } else {
        throw new Error(`HTTP method ${method} not implemented yet`);
      }
      
    } catch (error) {
      console.error('❌ [AUTH] Error making authenticated request:', error);
      throw error;
    }
  }
} 