// FUNZIONE PER TRADURRE I MESSAGGI DI ERRORE DA INGLESE A ITALIANO IN UNA FUTURA IMPLEMENTAZIONE DI GESSTIONE DELLA LINGUA ITALIANA
// UTILIZZA UN DIZIONARIO DI TRADUZIONE PER SOSTITUIRE LE FRASI DI ERRORE IN INGLESE CON LE LORO CONTROPARTI ITALIANE

export const translateErrorMessage = (errorMessage: string): string => {
  const translations: { [key: string]: string } = {
    // ERRORI GENERALI
    "User creation failed": "Creazione utente fallita",
    "Registration failed": "Registrazione fallita",
    "Ticket creation failed": "Creazione ticket fallita",
    "Failed to create ticket": "Impossibile creare il ticket",
    "An unknown error occurred": "Si è verificato un errore sconosciuto",
    "An error occurred": "Si è verificato un errore",
    "Default error": "Errore predefinito",
    "Operation failed": "Operazione fallita",
    "Something went wrong": "Qualcosa è andato storto",
    "Request failed": "Richiesta fallita",
    "Server error": "Errore del server",

    // ERRORI EMAIL
    "Email already exists": "L'email esiste già",
    "Email is already taken": "L'email è già in uso",
    "Invalid email": "Email non valida",
    "Email is required": "L'email è obbligatoria",
    "Email address is invalid": "L'indirizzo email non è valido",
    "Please enter a valid email": "Inserisci un'email valida",
    "Duplicate email": "Email duplicata",
    "is already taken": "è già in uso",
    "The email address is already in use": "L'indirizzo email è già in uso",

    // ERRORI PASSWORD
    "Password too short": "Password troppo corta",
    "Password is too short": "La password è troppo corta",
    "Password must be at least": "La password deve contenere almeno",
    characters: "caratteri",
    character: "carattere",

    // REQUISITI MAIUSCOLE
    "Password requires at least one uppercase letter":
      "La password deve contenere almeno una lettera maiuscola",
    "Password requires uppercase":
      "La password deve contenere lettere maiuscole",
    "Passwords must have at least one uppercase":
      "La password deve contenere almeno una lettera maiuscola",
    "Passwords must have at least one uppercase letter":
      "La password deve contenere almeno una lettera maiuscola",
    "at least one uppercase letter": "almeno una lettera maiuscola",

    // REQUISITI MINUSCOLE
    "Password requires at least one lowercase letter":
      "La password deve contenere almeno una lettera minuscola",
    "Password requires lowercase":
      "La password deve contenere lettere minuscole",
    "Passwords must have at least one lowercase":
      "La password deve contenere almeno una lettera minuscola",
    "Passwords must have at least one lowercase letter":
      "La password deve contenere almeno una lettera minuscola",
    "at least one lowercase letter": "almeno una lettera minuscola",

    // REQUISITI NUMERI
    "Password requires at least one digit":
      "La password deve contenere almeno un numero",
    "Password requires digit": "La password deve contenere un numero",
    "Passwords must have at least one digit":
      "La password deve contenere almeno un numero",
    "at least one digit": "almeno un numero",

    // REQUISITI CARATTERI SPECIALI
    "Password requires at least one non-alphanumeric character":
      "La password deve contenere almeno un carattere speciale",
    "Password requires special character":
      "La password deve contenere un carattere speciale",
    "Passwords must have at least one non alphanumeric character":
      "La password deve contenere almeno un carattere speciale",
    "at least one non-alphanumeric character": "almeno un carattere speciale",

    // ALTRI ERRORI PASSWORD
    "Password mismatch": "Le password non corrispondono",
    "Passwords do not match": "Le password non corrispondono",
    "Incorrect password": "Password non corretta",
    "Invalid password": "Password non valida",
    "Password is required": "La password è obbligatoria",
    "User already has a password": "L'utente ha già una password impostata",
    "Password requires unique characters":
      "La password deve contenere caratteri univoci",
    "unique characters": "caratteri univoci",

    // ERRORI NOME UTENTE
    "Username already exists": "Il nome utente esiste già",
    "Username is already taken": "Il nome utente è già in uso",
    "Invalid username": "Nome utente non valido",
    "Username is required": "Il nome utente è obbligatorio",
    "Username can only contain letters or digits":
      "Il nome utente può contenere solo lettere o numeri",
    "Duplicate username": "Nome utente duplicato",
    "User name is invalid": "Il nome utente non è valido",

    // ERRORI RUOLO
    "Invalid role": "Ruolo non valido",
    "Role does not exist": "Il ruolo non esiste",
    "Role name is invalid": "Il nome del ruolo non è valido",
    "Duplicate role": "Ruolo duplicato",
    "Role is already taken": "Il ruolo è già in uso",
    "User already in role": "L'utente è già nel ruolo specificato",
    "User not in role": "L'utente non è nel ruolo specificato",

    // ERRORI DI AUTENTICAZIONE
    "Invalid token": "Token non valido",
    "Token expired": "Token scaduto",
    "Token is invalid": "Il token non è valido",
    "Invalid login attempt": "Tentativo di login non valido",
    "Login failed": "Login fallito",
    "Invalid credentials": "Credenziali non valide",
    Unauthorized: "Non autorizzato",
    "Access denied": "Accesso negato",
    "Authentication failed": "Autenticazione fallita",
    "Not authenticated": "Non autenticato",
    "Session expired": "Sessione scaduta",

    // ERRORI ACCOUNT
    "User not found": "Utente non trovato",
    "Account locked": "Account bloccato",
    "Account disabled": "Account disabilitato",
    "Lockout not enabled": "Il blocco non è abilitato per questo utente",
    "User lockout not enabled":
      "Il blocco utente non è abilitato per questo utente",
    "Login already associated": "Login già associato",
    "A user with this login already exists":
      "Esiste già un utente con questo login",

    // ERRORI DI VALIDAZIONE
    "Field is required": "Il campo è obbligatorio",
    "Required field": "Campo obbligatorio",
    "Invalid input": "Input non valido",
    "Invalid format": "Formato non valido",
    "Value is invalid": "Il valore non è valido",
    "Please fill out this field": "Si prega di compilare questo campo",
    "This field cannot be empty": "Questo campo non può essere vuoto",
    "The dto": "I dati",
    "Il campo è obbligatorio": "Il campo è obbligatorio",
    "The JSON value could not be converted to":
      "Il valore JSON non può essere convertito in",
    Path: "Percorso",
    LineNumber: "Numero di riga",
    BytePositionInLine: "Posizione byte nella riga",

    // ERRORI NUMERO DI TELEFONO
    "Invalid phone number": "Numero di telefono non valido",
    "Phone number is required": "Il numero di telefono è obbligatorio",
    "Phone number format is invalid":
      "Il formato del numero di telefono non è valido",

    // ERRORI HTTP
    "Bad Request": "Richiesta non valida",
    Forbidden: "Accesso vietato",
    "Not Found": "Non trovato",
    "Internal Server Error": "Errore interno del server",
    "Service Unavailable": "Servizio non disponibile",
    "Gateway Timeout": "Timeout del gateway",
    "Network Error": "Errore di rete",
    "Connection failed": "Connessione fallita",
    "Request timeout": "Timeout della richiesta",

    // ERRORI DI CONCORRENZA
    "Concurrency failure": "Errore di concorrenza",
    "Optimistic concurrency failure":
      "Errore di concorrenza ottimistica, l'oggetto è stato modificato",
    "The record has been modified": "Il record è stato modificato",

    // ERRORI DI RECUPERO
    "Recovery code redemption failed": "Codice di recupero non valido",
    "Invalid recovery code": "Codice di recupero non valido",

    // PAROLE COMUNI
    user: "utente",
    password: "password",
    email: "email",
    username: "nome utente",
    role: "ruolo",
    failed: "fallito",
    error: "errore",
    invalid: "non valido",
    required: "obbligatorio",
    duplicate: "duplicato",
    already: "già",
    exists: "esiste",
    taken: "in uso",
    must: "deve",
    cannot: "non può",
    should: "dovrebbe",
    please: "per favore",
  };

  let translatedMessage = errorMessage;

  // SOSTITUISCE LE FRASI PIÙ LUNGHE PRIMA DELLE PIÙ CORTE
  // ORDINAMENTO PER LUNGHEZZA DECRESCENTE DEI TERMINI DI TRADUZIONE
  const sortedTranslations = Object.entries(translations).sort(
    (a, b) => b[0].length - a[0].length,
  );

  for (const [english, italian] of sortedTranslations) {
    translatedMessage = translatedMessage.replace(
      new RegExp(english, "gi"),
      italian,
    );
  }

  return translatedMessage;
};
