# Projet Full-Stack Angular + Spring Boot

Ce projet est une application full-stack utilisant Angular pour le frontend et Spring Boot pour le backend.

## Prérequis

- Java 17 ou supérieur
- Node.js 18 ou supérieur
- Maven
- Angular CLI
- MySQL 8.0 ou supérieur

## Installation

### Base de données MySQL

1. Assurez-vous que MySQL est installé et en cours d'exécution
2. Créez une base de données (elle sera créée automatiquement si elle n'existe pas)
3. Configurez les identifiants dans `backend/src/main/resources/application.properties` :
   - username: root (par défaut)
   - password: (votre mot de passe MySQL)

### Backend (Spring Boot)

1. Naviguez vers le dossier backend :
```bash
cd backend
```

2. Installez les dépendances Maven :
```bash
mvn clean install
```

3. Démarrez l'application Spring Boot :
```bash
mvn spring-boot:run
```

Le backend sera accessible à l'adresse : http://localhost:8080

### Frontend (Angular)

1. Naviguez vers le dossier frontend :
```bash
cd frontend
```

2. Installez les dépendances npm :
```bash
npm install
```

3. Démarrez l'application Angular :
```bash
ng serve
```

Le frontend sera accessible à l'adresse : http://localhost:4200

## Structure du Projet

```
.
├── backend/                 # Application Spring Boot
│   ├── src/
│   └── pom.xml
│
└── frontend/               # Application Angular
    ├── src/
    ├── package.json
    └── angular.json
```

## Fonctionnalités

- Backend Spring Boot avec :
  - Spring Web
  - Spring Data JPA
  - MySQL Database
  - Lombok

- Frontend Angular avec :
  - Angular 17
  - Bootstrap 5
  - RxJS
  - TypeScript 