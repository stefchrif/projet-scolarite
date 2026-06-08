package ma.uit.scolarite.exception;

/**
 * Levee pour une requete invalide cote metier (retourne HTTP 400).
 */
public class BadRequestException extends RuntimeException {
    public BadRequestException(String message) {
        super(message);
    }
}
