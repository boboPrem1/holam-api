// const jwt = require("jsonwebtoken");

// class CustomUtils {
//   static consts = {
//     MISSING_DATA: "Missing Data",
//     NOT_EXIST: "Not Exist",
//     INVALID_CREDENTIALS: "Invalid Credentials",
//     METHOD_NOT_ALLOWED: "Method not allowed",
//     EXISTING_ACCOUNT: "Un compte existe déjà avec les données fournies",
//     NOT_FOUND: "Not Found",
//     TOKEN_KEY: "miam_auth",
//     SUCCESS: "Success",
//     UNAUTHORIZED: "Unauthorized",
//     EXPIRED_OTP: "Otp expired or wrong code",
//     NOT_LOGGED_IN: "You are not logged in! Please log in to get access.",
//     EXISTING_POST_WITH_SOURCE: "Un article existe avec une source identique",
//   };

//   // Auth static methods
//   static signToken = (id, exp) => {
//     return jwt.sign({ id }, process.env.JWT_SECRET, {
//       expiresIn: exp ? exp : "7d",
//     });
//   };

//   static verifyToken = (token) => {
//     return jwt.verify(token, process.env.JWT_SECRET);
//   };

//   static getUserInId = (req) => {
//     const token = req.headers.authorization
//       ? req.headers.authorization.split(" ")[1]
//       : null;
//     const decoded = CustomUtils.verifyToken(token);
//     return decoded.id;
//   };

//   static generateUsername = () => {
//     const generatedNumber = Math.round(Math.random() * 9999);
//     const usernameSlugs = [
//       "awesome",
//       "great",
//       "amazing",
//       "fantastic",
//       "cool",
//       "nice",
//       "good",
//       "best",
//       "super",
//       "strong",
//       "wonderful",
//       "excellent",
//       "superb",
//       "marvelous",
//       "terrific",
//       "outstanding",
//       "splendid",
//       "remarkable",
//       "impressive",
//       "exceptional",
//       "magnificent",
//       "exquisite",
//       "fabulous",
//       "brilliant",
//       "incredible",
//       "phenomenal",
//       "fantastique",
//       "superior",
//       "top-notch",
//       "first-rate",
//       "prime",
//       "choice",
//       "quality",
//       "superlative",
//       "cool",
//       "rad",
//       "neat",
//       "stellar",
//       "ace",
//       "divine",
//     ];
//     const username = `${
//       usernameSlugs[Math.round(Math.random() * 9)]
//     }_${generatedNumber}`;
//     return username;
//   };

//   static advancedQuery = (query) => {
//     const queryObj = { ...query };
//     const excludedFields = [
//       "page",
//       "sort",
//       "limit",
//       "fields",
//       "_end",
//       "_start",
//       "view_user",
//     ];
//     excludedFields.forEach((element) => {
//       delete queryObj[element];
//     });

//     const queryObjKeys = Object.keys(queryObj);
//     queryObjKeys.map((item) => {
//       if (!(queryObj[item].length === 24 && queryObj[item].includes("64"))) {
//         const regex = new RegExp(queryObj[item], "i");
//         // console.log(regex);
//         queryObj[item] = { $regex: regex };
//       }
//     });
//     return queryObj;
//   };

//   static slugify = (from = "") => {
//     return from.toLowerCase().split(" ").join("-");
//   };

//   static getRandomNbr(max = 999999) {
//     return Math.floor(100000 + Math.random() * 900000).toString();
//   }

//   static getRandomStr(n) {
//     const characters =
//       "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
//     let result = "";
//     const charactersLength = characters.length;
//     for (let i = 0; i < n; i++) {
//       result += characters.charAt(Math.floor(Math.random() * charactersLength));
//     }
//     return result;
//   }

//   static formatDateLong(date) {
//   const options = { 
//     day: 'numeric', 
//     month: 'long', 
//     year: 'numeric', 
//     hour: '2-digit', 
//     minute: '2-digit',
//     hour12: false // Pour le format 24h
//   };

//   return new Intl.DateTimeFormat('fr-FR', options).format(date).replace(':', 'hr');
// }
// }

// module.exports = CustomUtils;


const jwt = require("jsonwebtoken");

class CustomUtils {
  // Constantes utilisées dans l'application
  static consts = {
    MISSING_DATA: "Missing Data",
    NOT_EXIST: "Not Exist",
    INVALID_CREDENTIALS: "Invalid Credentials",
    METHOD_NOT_ALLOWED: "Method not allowed",
    EXISTING_ACCOUNT: "Un compte existe déjà avec les données fournies",
    NOT_FOUND: "Not Found",
    TOKEN_KEY: "miam_auth",
    SUCCESS: "Success",
    UNAUTHORIZED: "Unauthorized",
    EXPIRED_OTP: "Otp expired or wrong code",
    NOT_LOGGED_IN: "You are not logged in! Please log in to get access.",
    EXISTING_POST_WITH_SOURCE: "Un article existe avec une source identique",
  };

  // Méthode pour signer un token JWT
  static signToken = (id, exp = "7d") => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
      expiresIn: exp,
    });
  };

  // Méthode pour vérifier un token JWT
  static verifyToken = (token) => {
    try {
      return jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      throw new Error("Invalid Token");
    }
  };

  // Méthode pour récupérer l'ID utilisateur à partir du token dans la requête
  static getUserInId = (req) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) throw new Error("No token provided");

    const decoded = CustomUtils.verifyToken(token);
    return decoded.id;
  };

  // Générer un nom d'utilisateur aléatoire
  static generateUsername = () => {
    const generatedNumber = Math.floor(Math.random() * 10000);
    const usernameSlugs = [
      "awesome",
      "great",
      "amazing",
      "fantastic",
      "cool",
      "nice",
      "good",
      "best",
      "super",
      "strong",
      "wonderful",
      "excellent",
      "superb",
      "marvelous",
      "terrific",
      "outstanding",
      "splendid",
      "remarkable",
      "impressive",
      "exceptional",
      "magnificent",
      "exquisite",
      "fabulous",
      "brilliant",
      "incredible",
      "phenomenal",
      "fantastique",
      "superior",
      "top-notch",
      "first-rate",
      "prime",
      "choice",
      "quality",
      "superlative",
      "rad",
      "neat",
      "stellar",
      "ace",
      "divine",
    ];
    const slug =
      usernameSlugs[Math.floor(Math.random() * usernameSlugs.length)];
    return `${slug}_${generatedNumber}`;
  };

  // Méthode pour formater les requêtes MongoDB avec exclusion de certains paramètres
  static advancedQuery = (query) => {
    const queryObj = { ...query };
    const excludedFields = [
      "page",
      "sort",
      "limit",
      "fields",
      "_end",
      "_start",
      "view_user",
    ];
    excludedFields.forEach((field) => delete queryObj[field]);

    Object.keys(queryObj).forEach((key) => {
      if (!(queryObj[key].length === 24 && queryObj[key].includes("64"))) {
        const regex = new RegExp(queryObj[key], "i");
        queryObj[key] = { $regex: regex };
      }
    });

    return queryObj;
  };

  // Transformer une chaîne de caractères en slug
  static slugify = (from = "") => {
    return from.toLowerCase().trim().replace(/\s+/g, "-");
  };

  // Générer un nombre aléatoire à 6 chiffres par défaut
  static getRandomNbr = (max = 999999) => {
    return Math.floor(100000 + Math.random() * (max - 100000)).toString();
  };

  // Générer une chaîne aléatoire de longueur n
  static getRandomStr = (n) => {
    const characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    return Array.from({ length: n }, () =>
      characters.charAt(Math.floor(Math.random() * characters.length))
    ).join("");
  };

  // Formater une date en format français, long
  static formatDateLong = (date) => {
    const options = {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false, // Format 24 heures
    };
    return new Intl.DateTimeFormat("fr-FR", options)
      .format(date)
      .replace(":", "h");
  };
}

module.exports = CustomUtils;
