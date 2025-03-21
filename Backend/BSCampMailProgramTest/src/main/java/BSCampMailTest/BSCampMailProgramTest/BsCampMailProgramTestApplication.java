package BSCampMailTest.BSCampMailProgramTest;

import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class BsCampMailProgramTestApplication implements CommandLineRunner{

	public static void main(String[] args) {
		SpringApplication.run(BsCampMailProgramTestApplication.class, args);
	}

	@Override
	public void run(String... args) throws Exception {
		System.out.println("Connected to Database Successfully!");
	}

}
