# Routes pour l'api

|Status|Table     |Type        |Utilite                                                                                                                                 |Method       |Requete                 | Params           |
|---   |-----     |----        |-------                                                                                                                                 |------       |------------------------|---------         |
| OK   | User     | Get        | Fourni une liste complete sur les donnees directs d'un joueur                                                                          | GET         | /users/:id             | id = user        |
| OK   | User     | Create     | Cree un user a partir des infos donnees au body                                                                                        | POST        | /users                 |                  |
| OK   | User     | Ajout      | Ajout un ami a user                                                                                                                    | POST        | /users/:id/friends     | id = user        |
| OK   | User     | Ajout      | Ajout un bloque a user                                                                                                                 | POST        | /users/:id/block       | id = user        |
| No   | User     | Update     | Met a jour les donnees globales du user                                                                                                | PATCH       | /users/:id             | id = user        |
| OK   | Match    | Get        | Donne les infos du match                                                                                                               | GET         | /matches/:id           | id = match       |
| No   | Match    | Update     | Mets a jour les donnees d'un match                                                                                                     | PATCH       | /matches/:id/          | id = match       |
| OK   | Match    | Get        | Donne tous les matchs d'un user                                                                                                        | GET         | /matches/:id/user      | id = user        |
| OK   | Match    | Get        | Donne un id de match, si son status = 0 alors la partie attend un auter joueur si = 1 alors la partie a ses deux joueurs               | GET         | /matches/:id/search    | id = user        |
| OK   | Conv     | Get        | Donne les donnees d'une conv, messages compris                                                                                         | GET         | /conv/:id              | id = conv        |
| OK   | Conv     | Get        | Donne les donnees d'une conv, messages compris d'un user                                                                               | GET         | /conv/:id/user         | id = user        |
| OK   | Conv     | Create     | Cree la conv avec un name, status et password                                                                                          | POST        | /conv                  |                  |
| OK   | Conv     | Ajout      | Ajoute des users a la conv                                                                                                             | POST        | /conv/:id/users        | id = conv        |
| OK   | Conv     | Ajout      | Ajoute des admins a la conv                                                                                                            | POST        | /conv/:id/admins       | id = conv        |
| OK   | Conv     | Ajout      | Ajoute des muteds a la conv                                                                                                            | POST        | /conv/:id/muteds       | id = conv        |
| No   | Conv     | Ajout      | Ajoute un message a la conv                                                                                                            | PATCH       | /conv/:id/message      | id = conv        |
| No   | Conv     | Update     | Modifie les donnees d'une conversation                                                                                                 | PATCH       | /conv/:id              | id = conv        |


Si il y a besoin d'une requete en plus non renseignee, le channel API sur discord est la pour ca

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

