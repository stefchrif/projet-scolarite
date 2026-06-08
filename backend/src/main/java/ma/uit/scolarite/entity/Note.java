package ma.uit.scolarite.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * Note attribuee a un etudiant pour un module (via son inscription).
 */
@Entity
@Table(name = "notes")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Note {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "inscription_id", nullable = false)
    private Inscription inscription;

    /** Valeur de la note sur 20. */
    @Column(nullable = false)
    private Double valeur;

    /** Type d'evaluation : CC (controle continu) ou EXAM (examen). */
    @Column(nullable = false)
    private String type;
}
