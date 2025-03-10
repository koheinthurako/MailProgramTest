package BSCampMailTest.BSCampMailProgramTest.DTO;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class MailRequest {
	
    private String title;
    private String subject;
    private String[] bccRecipients;

}
