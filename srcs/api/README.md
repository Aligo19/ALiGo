
# Api Request

    Principal lien :
        http://localhost:3000

# Sommaire

- [Users](##Users)
  - [Connecter un joueur](###Connecter-un-joueur)
  - [Mettre a jour les infos d'un joueur](###Mettre-a-jour-les-infos-d-un-joueur)
## Users

### Connecter un joueur

```http
  GET /users/${code}/login
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| code | int | Valeur de obtenue en se connectant via OAuth de 42 dans l'url sous le variable "code" voir le readme dedie (si j'en fais un je mettrais le lien ici sinon il y a une doc) |

#### Return:
Renvoit un JSON avec toutes les donnees liees au profil de l'utilisateur.

```JSON
{
    "ID_19": "hgoorick",
    "Pseudo": "hgoorick",
    "Avatar": "https://cdn.intra.42.fr/users/9fe27554c75228788d283a4dc48bf60c/hgoorick.png",
    "Elo": 0,
    "Actual_skin": 0,
    "Global_skin": [],
    "Wins": 0,
    "Loses": 0,
    "ID": 9
}
```

#### Details de l'output:
- ID renvoi vers l'id dans la db, ce sera cet id qui sera utilise pour les requetes API (Sauf si precisions dans une requete specifque)
- ID_19 renvoi vers le pseudo de 19, non utile en l'occurence
- Pseudo, tout est dans le nom
- Avatar, l'url vers l'image du joueur
- Elo equivaut au niveau du joueur, remplacant de la monnaie
- Actual_skin est la couleur actuelle de la barre de pong
- Global_skin est la liste de toutes les couleurs de la barre du joueur
- Wins est le total de victoires
- Loses est le total... bah de defaites

-----------
-----------

### Mettre a jour les infos d un joueur

```http
  PATCH /users/${id}
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| id | int | Valeur de l'utilisateur |

#### Input:
Donner le JSON ([Details](./README.md##JSON-User-1)) avec toutes les donnees modifiees du profil de l'utilisateur.

```JSON
{
    "ID": 1,
    "ID_19": "user_ID_19",
    "Pseudo": "LePlusBo",
    "Avatar": "NouvellePhoto",
    "Elo": 12,
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

#### Return:
Si le JSON ([Details](##JSON-User-1)) renvoye est identique a celui envoye ca signifie que la requete c'est convenablement executee, si pas une erreur est survenue.

-----------
-----------

### Avoir toutes les infos d'un joueur

```http
  GET /users/${id}
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| id | int | Valeur de l'utilisateur |

#### Return:
Renvoit un JSON ([Details](##JSON-User-1)) avec toutes les donnees liees au profil de l'utilisateur.

```JSON
{
    "ID": 1,
    "ID_19": "user_ID_19",
    "Pseudo": "User",
    "Avatar": "user_avatar_url",
    "Elo": 200,
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

-----------
-----------

### Ajouter un ami

```http
  GET /users/${id}/friends/${friendName}/add
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| id | int | Valeur de l'utilisateur |
| friendName | string | Nom de l'utilisateur qu'on veut ajouter |

#### Return:
Si rien n'est renvoye la requete a marche sinon une erreur est survenue

-----------
-----------

### Bloquer un utilisateur

```http
  GET /users/${id}/block/${blockName}/add
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| id | int | Valeur de l'utilisateur |
| blockName | string | Nom de l'utilisateur qu'on veut bloquer |

#### Return:
Si rien n'est renvoye la requete a marche sinon une erreur est survenue

-----------
-----------
-----------
-----------
-----------
-----------
-----------

## Match

### Avoir toutes les infos d'un match

```http
  GET /matches/${id}
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| id | int | Valeur de l'id du match |

#### Return:
Renvoit un JSON ([Details](##JSON-Match-1)) avec toutes les donnees liees a un match.

```JSON
{
    "ID": 1,
    "Score_user1": 3,
    "Score_user2": 2,
    "Status": 1,
    "ID_user1": {
        "ID": 1,
        "ID_19": "user1_ID_19",
        "Pseudo": "User1",
        "Avatar": "user1_avatar_url",
        "Elo": 200,
        "Actual_skin": 3,
        "Global_skin": [
            1,
            2,
            3,
            4
        ],
        "Wins": 20,
        "Loses": 10
    },
    "ID_user2": {
        "ID": 2,
        "ID_19": "friend1_ID_19",
        "Pseudo": "User2",
        "Avatar": "friend1_avatar_url",
        "Elo": 100,
        "Actual_skin": 1,
        "Global_skin": [
            1,
            2,
            3
        ],
        "Wins": 10,
        "Loses": 5
    }
}
```

-----------
-----------

### Avoir toutes les infos des matchs d'un utilisateur

```http
  GET /matches/${idUser}/user
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| id | int | Valeur de l'id de l'utilisateur |

#### Return:
Renvoit une liste de JSON. Chaque element est un match avec un JSON  ([Details](##JSON-Match-1))

```JSON
[
  {
      "ID": 1,
      "Score_user1": 3,
      "Score_user2": 2,
      "Status": 1,
      "ID_user1": {
          "ID": 1,
          "ID_19": "user1_ID_19",
          "Pseudo": "User1",
          "Avatar": "user1_avatar_url",
          "Elo": 200,
          "Actual_skin": 3,
          "Global_skin": [
              1,
              2,
              3,
              4
          ],
          "Wins": 20,
          "Loses": 10
      },
      "ID_user2": {
          "ID": 2,
          "ID_19": "friend1_ID_19",
          "Pseudo": "User2",
          "Avatar": "friend1_avatar_url",
          "Elo": 100,
          "Actual_skin": 1,
          "Global_skin": [
              1,
              2,
              3
          ],
          "Wins": 10,
          "Loses": 5
      }
  },
  {
      "ID": 2,
      "Score_user1": 3,
      "Score_user2": 2,
      "Status": 1,
      "ID_user1": {
          "ID": 1,
          "ID_19": "user1_ID_19",
          "Pseudo": "User1",
          "Avatar": "user1_avatar_url",
          "Elo": 200,
          "Actual_skin": 3,
          "Global_skin": [
              1,
              2,
              3,
              4
          ],
          "Wins": 20,
          "Loses": 10
      },
      "ID_user2": {
          "ID": 2,
          "ID_19": "friend1_ID_19",
          "Pseudo": "User2",
          "Avatar": "friend1_avatar_url",
          "Elo": 100,
          "Actual_skin": 1,
          "Global_skin": [
              1,
              2,
              3
          ],
          "Wins": 10,
          "Loses": 5
      }
  }
]
```

-----------
-----------

### Lancer une recherche pour une game

```http
  GET /matches/${id}/search
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| id | int | Valeur de l'id du match |

#### Return:
Renvoit un JSON ([Details](##JSON-Match-1)) avec toutes les donnees liees a un match.
Deux cas de figure possible
1. le status est 0 alors la game vient d'etre cree et en attente du joueur 2
2. le status est 1 alors la game a ses deux joueurs et la partie peut commencer

```JSON
{
    "ID_user1": {
        "ID": 1,
        "ID_19": "user1_ID_19",
        "Pseudo": "User1",
        "Avatar": "user1_avatar_url",
        "Elo": 200,
        "Actual_skin": 3,
        "Global_skin": [
            1,
            2,
            3,
            4
        ],
        "Wins": 20,
        "Loses": 10
    },
    "ID_user2": null,
    "Score_user1": 0,
    "Score_user2": 0,
    "Status": 0,
    "ID": 33
}
```

-----------
-----------

### Finir une game

```http
  POST /matches/end
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| - | - | - |

#### Input:
Recoit un JSON avec l'id et les scores, cela mettra les donnes des joueurs sur la DB a jour automatiquement

```JSON
{
  "Score_user1" : 1,
  "Score_user2" : 3,
  "Id": 33
}
```


#### Return:
Renvoit un JSON ([Details](##JSON-Match-1)) avec toutes les donnees liees a un match.
Si ce n'est pas le cas alors la requete est corrompue
```JSON
{
    "ID": 33,
    "Score_user1": 0,
    "Score_user2": 0,
    "Status": 2,
    "ID_user1": {
        "ID": 1,
        "ID_19": "user1_ID_19",
        "Pseudo": "User1",
        "Avatar": "user1_avatar_url",
        "Elo": 190,
        "Actual_skin": 3,
        "Global_skin": [
            1,
            2,
            3,
            4
        ],
        "Wins": 20,
        "Loses": 10
    },
    "ID_user2": {
        "ID": 2,
        "ID_19": "friend1_ID_19",
        "Pseudo": "User2",
        "Avatar": "friend1_avatar_url",
        "Elo": 110,
        "Actual_skin": 1,
        "Global_skin": [
            1,
            2,
            3
        ],
        "Wins": 10,
        "Loses": 5
    }
}
```
-----------
-----------
-----------
-----------
-----------
-----------
-----------

## Conv TODO

### Toutes les donnees d'une conv

```http
  GET /conv/${id}
```

-----------
-----------

### Toutes les conv pour un utilisateur

```http
  GET /conv/${id}/user
```

-----------
-----------

### Toutes les conv pour un utilisateur

```http
  GET /conv/${id}/user
```

-----------
-----------

### Banni un utilisateur d'une conv

```http
  GET /conv/:id/banned/:bannedId
```

-----------
-----------

### Ajoute un utilisateur a une conv

```http
  POST /conv/:id/users
```

-----------
-----------

### Ajoute un utilisateur en tant qu'admin

```http
  POST /conv/:id/admins
```

-----------
-----------

### Ajoute un utilisateur en tant que mute

```http
  POST /conv/:id/muteds
```

-----------
-----------

### Ajoute un message dans une conv

```http
  POST /conv/:id/message
```

-----------
-----------

-----------
-----------
-----------
-----------
-----------
-----------
-----------

# Details sur les JSON

## JSON User 1
```JSON
{
    "ID": 1,
    "ID_19": "user_ID_19",
    "Pseudo": "User",
    "Avatar": "user_avatar_url",
    "Elo": 200,
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
- ID renvoi vers l'id dans la db, ce sera cet id qui sera utilise pour les requetes API (Sauf si precisions dans une requete specifque)
- ID_19 renvoi vers le pseudo de 19, non utile en l'occurence
- Pseudo, tout est dans le nom
- Avatar, l'url vers l'image du joueur
- Elo equivaut au niveau du joueur, remplacant de la monnaie
- Actual_skin est la couleur actuelle de la barre de pong
- Global_skin est la liste de toutes les couleurs de la barre du joueur
- Wins est le total de victoires
- Loses est le total... bah de defaites

## JSON Match 1

```JSON
{
    "ID": 1,
    "Score_user1": 3,
    "Score_user2": 2,
    "Status": 1,
    "ID_user1": {
        "ID": 1,
        "ID_19": "user1_ID_19",
        "Pseudo": "User1",
        "Avatar": "user1_avatar_url",
        "Elo": 200,
        "Actual_skin": 3,
        "Global_skin": [
            1,
            2,
            3,
            4
        ],
        "Wins": 20,
        "Loses": 10
    },
    "ID_user2": {
        "ID": 2,
        "ID_19": "friend1_ID_19",
        "Pseudo": "User2",
        "Avatar": "friend1_avatar_url",
        "Elo": 100,
        "Actual_skin": 1,
        "Global_skin": [
            1,
            2,
            3
        ],
        "Wins": 10,
        "Loses": 5
    }
}
```
- ID renvoi vers l'id du match
- Score_user1, les points marque par le joueur 1
- Score_user2, les points marque par le joueur 2
- Status; 0 vaut en recherche, 1 vaut en cours, 2 vaut fini
- ID_user1 donne toutes les infos du joueur 1 voir [Details](##JSON-User-1)
- ID_user2 donne toutes les infos du joueur 2 voir [Details](##JSON-User-1)

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

