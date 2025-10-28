// src/lib/services/smsService.js
// SMS notification service using Africa's Talking

import AfricasTalking from 'africastalking';

const credentials = {
  apiKey: process.env.AFRICASTALKING_API_KEY,
  username: process.env.AFRICASTALKING_USERNAME || 'sandbox',
};

const africastalking = AfricasTalking(credentials);
const sms = africastalking.SMS;

// Send price alert SMS
export async function sendPriceAlertSMS({
  to,
  name,
  fuelType,
  location,
  oldPrice,
  newPrice,
  change,
  percentageChange,
}) {
  try {
    const isIncrease = change > 0;
    const changeIcon = isIncrease ? '📈' : '📉';
    const changeText = isIncrease ? 'increased' : 'decreased';

    // Keep SMS concise (160 characters is standard)
    const message = `${changeIcon} FUEL ALERT\n${fuelType} in ${location} ${changeText} by ${Math.abs(percentageChange).toFixed(1)}%\n\nOld: KES ${oldPrice.toFixed(2)}\nNew: KES ${newPrice.toFixed(2)}\n\nEston Distributors\n+254 722 943 291`;

    const options = {
      to: [to],
      message: message,
      // from: 'ESTON', // Sender ID (requires approval from Africa's Talking)
    };

    const response = await sms.send(options);

    // Check if SMS was sent successfully
    if (response.SMSMessageData && response.SMSMessageData.Recipients) {
      const recipient = response.SMSMessageData.Recipients[0];
      
      if (recipient.statusCode === 101 || recipient.statusCode === 102) {
        // 101 = Sent successfully, 102 = Queued
        return {
          success: true,
          messageId: recipient.messageId,
          status: recipient.status,
          cost: recipient.cost
        };
      } else {
        return {
          success: false,
          error: recipient.status || 'Failed to send SMS'
        };
      }
    }

    return {
      success: false,
      error: 'Invalid response from Africa\'s Talking'
    };
  } catch (error) {
    console.error('Error sending SMS:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

// Send verification SMS
export async function sendVerificationSMS({ to, name, verificationCode }) {
  try {
    const message = `Hi ${name},\n\nYour verification code for Eston Price Alerts is: ${verificationCode}\n\nEnter this code to activate SMS alerts.\n\nEston Distributors`;

    const options = {
      to: [to],
      message: message,
    };

    const response = await sms.send(options);

    if (response.SMSMessageData && response.SMSMessageData.Recipients) {
      const recipient = response.SMSMessageData.Recipients[0];
      
      if (recipient.statusCode === 101 || recipient.statusCode === 102) {
        return {
          success: true,
          messageId: recipient.messageId,
          status: recipient.status
        };
      } else {
        return {
          success: false,
          error: recipient.status || 'Failed to send verification SMS'
        };
      }
    }

    return {
      success: false,
      error: 'Invalid response from Africa\'s Talking'
    };
  } catch (error) {
    console.error('Error sending verification SMS:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

// Send welcome SMS
export async function sendWelcomeSMS({ to, name }) {
  try {
    const message = `Welcome ${name}! 🎉\n\nYou're now subscribed to Eston fuel price alerts via SMS.\n\nYou'll receive notifications when prices change.\n\nEston Distributors\n+254 722 943 291`;

    const options = {
      to: [to],
      message: message,
    };

    const response = await sms.send(options);

    if (response.SMSMessageData && response.SMSMessageData.Recipients) {
      const recipient = response.SMSMessageData.Recipients[0];
      
      if (recipient.statusCode === 101 || recipient.statusCode === 102) {
        return {
          success: true,
          messageId: recipient.messageId
        };
      } else {
        return {
          success: false,
          error: recipient.status
        };
      }
    }

    return {
      success: false,
      error: 'Invalid response'
    };
  } catch (error) {
    console.error('Error sending welcome SMS:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

// Send test SMS
export async function sendTestSMS(to) {
  try {
    const message = `This is a test message from Eston Distributors. Your SMS alerts are working correctly! 📱\n\nCall us: +254 722 943 291`;

    const options = {
      to: [to],
      message: message,
    };

    const response = await sms.send(options);

    if (response.SMSMessageData && response.SMSMessageData.Recipients) {
      const recipient = response.SMSMessageData.Recipients[0];
      
      return {
        success: recipient.statusCode === 101 || recipient.statusCode === 102,
        status: recipient.status,
        messageId: recipient.messageId,
        cost: recipient.cost
      };
    }

    return {
      success: false,
      error: 'Invalid response'
    };
  } catch (error) {
    console.error('Error sending test SMS:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

// Format phone number for Kenya
export function formatPhoneNumber(phone) {
  // Remove all non-digit characters
  let cleaned = phone.replace(/\D/g, '');
  
  // If starts with 0, replace with 254
  if (cleaned.startsWith('0')) {
    cleaned = '254' + cleaned.substring(1);
  }
  
  // If doesn't start with +, add it
  if (!cleaned.startsWith('254')) {
    cleaned = '254' + cleaned;
  }
  
  return '+' + cleaned;
}

// Validate Kenyan phone number
export function isValidKenyanPhone(phone) {
  const cleaned = phone.replace(/\D/g, '');
  
  // Should be 10 digits starting with 07 or 01
  // OR 12 digits starting with 254
  if (cleaned.length === 10 && (cleaned.startsWith('07') || cleaned.startsWith('01'))) {
    return true;
  }
  
  if (cleaned.length === 12 && cleaned.startsWith('254')) {
    return true;
  }
  
  return false;
}