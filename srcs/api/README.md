# Routes pour l'api

|url                   |method  |details                                          |
|----------------------|--------|-------------------------------------------------|
|users                 |        |                                                 |
|users/:id             | GET    | Donne toutes les infos relatives au user        |
|users                 | POST   | Cree un user a partir des infos donnees au body |
|users/:id/friends     | POST   | Ajout un ami a user                             |
|users/:id/block       | POST   | Ajout un bloque a user                          |
|users/:id             | PATCH  | Met a jour les donnees du user                  |
|matches               |        |                                                 |
|matches/:id           | GET    | Donne les infos du match                        |
|matches/user/:userId  | GET    | Donne tous les matchs d'un user                 |
|matches               | POST   | Ajoute les donnees d'un match                   |
|conv                  |        |                                                 |
|conv/:id              | GET    | Donne les donnees d'une conv                    |
|conv/:id/users        | GET    | Donne les conv d'un id user                     |
|conv                  | POST   | Cree la conv avec un name, status et password   |
|conv/:id/users        | POST   | Ajoute un user a la conv                        |
|conv/:id/admins       | POST   | Ajoute un admin a la conv                       |
|conv/:id/muteds       | POST   | Ajoute un muted a la conv                       |

Une requete ce fait comme suit
```url
 http://localhost:3000/<request>
```

Exemple :
```
INPUT :
    http://localhost:3000/users/1

OUTPUT:
  {
      "ID": 1,
      "ID_19": "user1_ID_19",
      "Pseudo": "User1",
      "Avatar": "user1_avatar_url",
      "Coins": 200,
      "Actual_skin": 3,
      "Global_skin": [
          1,
          2,
          3,
          4
      ],
      "Wins": 20,
      "Loses": 10
  }
```

# Details sur l'organisation des fichiers

Le code se situe dans srcs
Le fichier app.module reprend tous les modules present dans les dossiers, ca peut ressembler a un include (je fais simple)
Pour le main, il est l'index/main de nestJS. C'est lui qui va tout lancer et start le projet.

Ensuite nous avons 3 dossiers principaux:
  - conv
  - match
  - user

Dans chacun se trouve 6 fichiers:

    - create.dto
      Reprend le schema qui sera recu dans les requetes POST ou PATCH

    - controller
      Reprend toutes les routes API

    - entity
      Reprend l'architecture dans la DB

    - module
      Reprend tous les fichiers de config en un seul

    - seed
      Reprend des donnes inits par defaut au lancement du serveur

    - service
      Reprend toutes les requetes vers la DB

PS: les possibles fichiers objets sont des classes structurees a la maniere d'un JSON pour PostgreSQL

Pour ce qui est du dossier datas, il reprend des fichiers JSON utilise par les fichiers seed pour setup des valeurs tests a l'init (voir les fichiers seed).

# Details sur la DB

Elle est generee par NestJS a l'init du projet, il s'agit de PostgreSQL interpete en TypeORM. 

Voici un text recap de l'architecture:

- La table user reprend:
  - ID qui est une primary key
  - ID_19 qui est un string
  - Pseudo qui est un string
  - Avatar qui est un url en string
  - Friends qui est un tableau de int pour lister les id d’autre user en foreigns key
  - Coins qui est un int pour la somme de pieces du joueur
  - Actual_skin qui est un int pour le rgb de la barre de pong
  - Global_skin qui est tableau de int reprenant tous les rgb du joueur
  - Blocked qui est tableau de int reprenant les id d’autre user en foreigns key
  - Wins qui est un int pour le nombre de partie gagnées
  - Loses qui est un int pour le nombre de partie perdues

- La table match reprend:
  - ID qui est une primary key
  - ID_user1 qui est un int en foreign key sur la table user
  - ID_user2 qui est un int en foreign key sur la table user
  - Score_user1 qui est un int pour les points du premier user
  - Score_user1 qui est un int pour les points du deuxième user

- La table conv reprend :
  - ID qui est une primary key
  - Name qui est un string
  - Users qui est une liste de int reprenant les id de la user en foreign key
  - Admin qui est une liste de int reprenant les id de la user en foreign key
  - Status qui est un int pour le type de la conversation
  - Password qui est un string par défaut NULL n’aura de valeur que si le Status est en prive
  - Muted qui est une liste de int reprenant les id de la user en foreign key
  - Messages qui est une liste d’objets Message (voir en dessous)

- L’objet Message:
  - ID_user qui reprend un id user en foreign key
  - data qui est un string long
  - Logged_at qui est un datetime

