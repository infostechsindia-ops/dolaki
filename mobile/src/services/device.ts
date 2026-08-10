export interface BiometricAuthResult {
  success: boolean;
  error?: string;
}

export class DeviceIntegrationService {
  async authenticateBiometric(reason = 'Verify your identity'): Promise<BiometricAuthResult> {
    // Abstraction for Face ID / Touch ID / Android Biometrics
    return { success: true };
  }

  async triggerHapticFeedback(style: 'light' | 'medium' | 'heavy' = 'light'): Promise<void> {
    // Abstraction for native haptic feedback
  }

  async shareContent(title: string, message: string, url?: string): Promise<boolean> {
    // Abstraction for native Share Sheet
    return true;
  }

  async copyToClipboard(text: string): Promise<boolean> {
    // Abstraction for native Clipboard
    return true;
  }
}

export const deviceIntegration = new DeviceIntegrationService();
