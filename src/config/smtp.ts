// Configuration SMTP par défaut
export const SMTP_CONFIG = {
  host: "smtp.zeptomail.com",
  port: 587,
  username: "emailapikey",
  password: "wSsVR61+qRH5X6d1yTGpJuhtzAlRVFOkF0x73ATwvXD9SqzL8sc4wRGcBAL0SqUcFzQ/ETMT8bh9nEsD1DcLidopzAwCXCiF9mqRe1U4J3x17qnvhDzMXm5amxCOKI4OwQ9qkmlkE84m+g==",
  fromEmail: "noreply@teamtalk.com"
};

// Configuration de sécurité pour l'envoi d'emails
export const EMAIL_SECURITY = {
  secure: false, // true pour 465, false pour les autres ports
  requireTLS: true,
  tls: {
    ciphers: 'SSLv3'
  }
};
