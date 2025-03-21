package BSCampMailTest.BSCampMailProgramTest.Util;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Component;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;

@Component
public class EmailUtil {

    @Autowired
    private JavaMailSender javaMailSender;

    public void setMailSender(JavaMailSender mailSender) {  
        this.javaMailSender = mailSender;  
    }  

    public void sendMailWithBCC(String subject, String htmlContent, String... bccRecipients) throws MessagingException {
        MimeMessage mimeMessage = javaMailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true, "UTF-8");

        helper.setTo("yoonwadiaung9999@gmail.com");
        helper.setSubject(subject);
        helper.setText(htmlContent, true);
        helper.setBcc(bccRecipients);

        javaMailSender.send(mimeMessage);
    }
}