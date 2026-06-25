export const sendEmail = async (to: string, subject: string, body: string): Promise<void> => {
  // Simulate SendGrid network delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  console.log('\n=================================================');
  console.log(`[MOCK SENDGRID] Email Dispatched Successfully`);
  console.log(`To: ${to}`);
  console.log(`Subject: ${subject}`);
  console.log(`Body:\n${body}`);
  console.log('=================================================\n');
};

export const sendSMS = async (to: string, message: string): Promise<void> => {
  // Simulate Twilio network delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  console.log('\n=================================================');
  console.log(`[MOCK TWILIO] SMS Dispatched Successfully`);
  console.log(`To: ${to}`);
  console.log(`Message: ${message}`);
  console.log('=================================================\n');
};
