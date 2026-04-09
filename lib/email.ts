import { Resend } from 'resend';
import { Submission } from './db/schema';

const resend = new Resend(process.env.RESEND_API_KEY);
const FROM_EMAIL = 'onboarding@resend.dev'; // Resend default for unverified domains
const ADMIN_EMAIL = process.env.ADMIN_NOTIFICATION_EMAIL || 'atlasbuildersubs@gmail.com';

/**
 * Sends a notification to the Arcium Atlas team about a new submission.
 * Designed with a "system log" aesthetic.
 */
export async function sendAdminNotification(submission: Submission) {
  try {
    const { data, error } = await resend.emails.send({
      from: `Atlas System <${FROM_EMAIL}>`,
      to: ADMIN_EMAIL,
      subject: `[SYSTEM_ALERT] NEW_SUBMISSION: ${submission.projectName}`,
      html: `
        <div style="background-color: #000; color: #00ffa3; font-family: 'Courier New', Courier, monospace; padding: 20px; border: 1px solid #00ffa3;">
          <h2 style="border-bottom: 1px solid #00ffa3; padding-bottom: 10px;">&gt; INCOMING_TRANSMISSION</h2>
          <p><strong>TIMESTAMP:</strong> ${new Date(submission.createdAt).toISOString()}</p>
          <p><strong>PROJECT:</strong> ${submission.projectName}</p>
          <p><strong>SUBMITTER:</strong> ${submission.submitterName} (${submission.submitterEmail})</p>
          <p><strong>CATEGORY:</strong> ${submission.category}</p>
          
          <div style="margin-top: 20px; border-top: 1px solid #333; padding-top: 10px;">
            <p>&gt; SUMMARY_START</p>
            <p style="color: #ccc;">${submission.projectSummary}</p>
            <p>&gt; SUMMARY_END</p>
          </div>

          <div style="margin-top: 30px;">
            <a href="${process.env.NEXT_PUBLIC_SITE_URL || 'https://arcium-atlas.vercel.app'}/admin/submissions" 
               style="background-color: #00ffa3; color: #000; padding: 10px 20px; text-decoration: none; font-weight: bold; text-transform: uppercase;">
              [ Access_Control_Panel ]
            </a>
          </div>
          
          <p style="margin-top: 40px; font-size: 10px; color: #666;">
            AUTO_GENERATED_BY_ATLAS_CORE // SECURE_TRANSMISSION_PROTOCOL
          </p>
        </div>
      `,
    });

    if (error) {
      console.error('[Resend Admin] Error:', error);
      return { success: false, error };
    }
    return { success: true, data };
  } catch (err) {
    console.error('[Resend Admin] Unexpected Error:', err);
    return { success: false, error: err };
  }
}

/**
 * Sends a confirmation email to the builder who submitted the project.
 */
export async function sendBuilderConfirmation(submission: Submission) {
  try {
    const { data, error } = await resend.emails.send({
      from: `Arcium Atlas <${FROM_EMAIL}>`,
      to: submission.submitterEmail,
      subject: `Submission Received: ${submission.projectName}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; line-height: 1.6; color: #333;">
          <h1 style="color: #000;">Submission Received</h1>
          <p>Hello ${submission.submitterName},</p>
          <p>Thank you for submitting <strong>${submission.projectName}</strong> to the Arcium Atlas ecosystem directory.</p>
          <p>Our team will review your submission shortly. You will be notified once it has been processed.</p>
          
          <div style="background-color: #f4f4f4; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0;">Submission Summary</h3>
            <p><strong>Project:</strong> ${submission.projectName}</p>
            <p><strong>Category:</strong> ${submission.category}</p>
            <p><strong>Status:</strong> Pending Review</p>
          </div>
          
          <p>Best regards,<br/>The Arcium Atlas Team</p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;" />
          <p style="font-size: 12px; color: #999;">
            This is an automated confirmation. Please do not reply directly to this email.
          </p>
        </div>
      `,
    });

    if (error) {
      console.error('[Resend Builder] Error:', error);
      return { success: false, error };
    }
    return { success: true, data };
  } catch (err) {
    console.error('[Resend Builder] Unexpected Error:', err);
    return { success: false, error: err };
  }
}

/**
 * Notifies the builder when their project status has been updated (Approved/Rejected).
 */
export async function sendBuilderStatusUpdate(submission: Submission) {
  try {
    const isApproved = submission.status === 'approved';
    const subject = isApproved 
      ? `Project Approved: ${submission.projectName}` 
      : `Submission Update: ${submission.projectName}`;

    const { data, error } = await resend.emails.send({
      from: `Arcium Atlas <${FROM_EMAIL}>`,
      to: submission.submitterEmail,
      subject,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; line-height: 1.6; color: #333;">
          <h1 style="color: ${isApproved ? '#00ffa3' : '#000'};">Submission Update</h1>
          <p>Hello ${submission.submitterName},</p>
          <p>Your submission for <strong>${submission.projectName}</strong> has been <strong>${submission.status}</strong>.</p>
          
          ${isApproved 
            ? `<p>Congratulations! Your project is now being indexed into the Arcium Atlas directory. You can view the live directory at the link below:</p>` 
            : `<p>Thank you for your interest in the Arcium Atlas. At this time, we have decided not to move forward with your submission. We appreciate your contribution to the ecosystem.</p>`
          }

          <div style="margin-top: 30px;">
            <a href="${process.env.NEXT_PUBLIC_SITE_URL || 'https://arcium-atlas.vercel.app'}/ecosystem" 
               style="background-color: #000; color: #fff; padding: 10px 20px; text-decoration: none; border-radius: 4px; font-weight: bold;">
              Visit Arcium Atlas
            </a>
          </div>
          
          <p style="margin-top: 40px;">Best regards,<br/>The Arcium Atlas Team</p>
        </div>
      `,
    });

    if (error) {
      console.error('[Resend Status Update] Error:', error);
      return { success: false, error };
    }
    return { success: true, data };
  } catch (err) {
    console.error('[Resend Status Update] Unexpected Error:', err);
    return { success: false, error: err };
  }
}
