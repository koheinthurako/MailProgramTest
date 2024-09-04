package BSCampMailTest.BSCampMailProgramTest.Service;

public interface MailService {
	
	public String sendMail(String title, String subject, String[] bccRecipients);

}
