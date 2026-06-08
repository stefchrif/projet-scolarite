package ma.uit.scolarite.exception;

/**
 * Levee lorsqu'une ressource demandee n'existe pas (retourne HTTP 404).
 */
public class ResourceNotFoundException extends RuntimeException {
    public ResourceNotFoundException(String message) {
        super(message);
    }
}
