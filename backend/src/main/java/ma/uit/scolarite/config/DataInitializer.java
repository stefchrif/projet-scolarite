package ma.uit.scolarite.config;

import lombok.RequiredArgsConstructor;
import ma.uit.scolarite.entity.*;
import ma.uit.scolarite.entity.Module;
import ma.uit.scolarite.repository.*;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDate;

/**
 * Insere des donnees de demonstration au demarrage (profil dev uniquement).
 * Comptes : admin/admin123, prof/prof123, etudiant/etud123
 */
@Component
@Profile("!prod")
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final FiliereRepository filiereRepository;
    private final EtudiantRepository etudiantRepository;
    private final EnseignantRepository enseignantRepository;
    private final ModuleRepository moduleRepository;
    private final InscriptionRepository inscriptionRepository;
    private final NoteRepository noteRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        if (userRepository.count() > 0) {
            return;
        }

        // --- Utilisateurs ---
        userRepository.save(User.builder()
                .username("admin").password(passwordEncoder.encode("admin123"))
                .nomComplet("Administrateur").role(Role.ADMIN).build());
        userRepository.save(User.builder()
                .username("prof").password(passwordEncoder.encode("prof123"))
                .nomComplet("Khalid Housni").role(Role.ENSEIGNANT).build());
        userRepository.save(User.builder()
                .username("etudiant").password(passwordEncoder.encode("etud123"))
                .nomComplet("Mohamed Etudiant").role(Role.ETUDIANT).build());

        // --- Filieres ---
        Filiere gl = filiereRepository.save(Filiere.builder()
                .nom("Genie Logiciel").niveau("Licence 3").build());
        Filiere si = filiereRepository.save(Filiere.builder()
                .nom("Systemes d'Information").niveau("Licence 2").build());

        // --- Enseignants ---
        Enseignant ens1 = enseignantRepository.save(Enseignant.builder()
                .nom("Housni").prenom("Khalid").email("k.housni@uit.ac.ma")
                .specialite("Genie Logiciel / Java").build());
        Enseignant ens2 = enseignantRepository.save(Enseignant.builder()
                .nom("Hamida").prenom("Said").email("s.hamida@uit.ac.ma")
                .specialite("Bases de donnees").build());

        // --- Modules ---
        Module m1 = moduleRepository.save(Module.builder()
                .code("SPR101").intitule("Framework Spring").semestre("S5")
                .filiere(gl).enseignant(ens1).build());
        Module m2 = moduleRepository.save(Module.builder()
                .code("REA102").intitule("Developpement React").semestre("S5")
                .filiere(gl).enseignant(ens1).build());
        Module m3 = moduleRepository.save(Module.builder()
                .code("BDD201").intitule("Bases de donnees avancees").semestre("S4")
                .filiere(si).enseignant(ens2).build());

        // --- Etudiants ---
        Etudiant e1 = etudiantRepository.save(Etudiant.builder()
                .nom("El Atrassi").prenom("Mustapha").cne("R130000001")
                .email("mustapha@etu.uit.ac.ma").dateNaissance(LocalDate.of(2002, 3, 14))
                .filiere(gl).build());
        Etudiant e2 = etudiantRepository.save(Etudiant.builder()
                .nom("Bennani").prenom("Salma").cne("R130000002")
                .email("salma@etu.uit.ac.ma").dateNaissance(LocalDate.of(2003, 7, 21))
                .filiere(gl).build());
        Etudiant e3 = etudiantRepository.save(Etudiant.builder()
                .nom("Tazi").prenom("Youssef").cne("R130000003")
                .email("youssef@etu.uit.ac.ma").dateNaissance(LocalDate.of(2002, 11, 2))
                .filiere(si).build());

        // --- Inscriptions ---
        Inscription i1 = inscriptionRepository.save(Inscription.builder()
                .etudiant(e1).module(m1).dateInscription(LocalDate.now()).build());
        Inscription i2 = inscriptionRepository.save(Inscription.builder()
                .etudiant(e1).module(m2).dateInscription(LocalDate.now()).build());
        Inscription i3 = inscriptionRepository.save(Inscription.builder()
                .etudiant(e2).module(m1).dateInscription(LocalDate.now()).build());
        inscriptionRepository.save(Inscription.builder()
                .etudiant(e3).module(m3).dateInscription(LocalDate.now()).build());

        // --- Notes ---
        noteRepository.save(Note.builder().inscription(i1).valeur(15.5).type("CC").build());
        noteRepository.save(Note.builder().inscription(i1).valeur(13.0).type("EXAM").build());
        noteRepository.save(Note.builder().inscription(i2).valeur(17.0).type("CC").build());
        noteRepository.save(Note.builder().inscription(i3).valeur(11.5).type("EXAM").build());
    }
}
