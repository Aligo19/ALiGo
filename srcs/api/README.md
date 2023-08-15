
Si des erreurs surviennent ou des manques de comprehension merci de bien fermer les yeux et faire genre ca marche

# Api Request

    Principal lien :
        http://localhost:3000

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
Donner le JSON ([Details](##JSON-User-1)) avec toutes les donnees modifiees du profil de l'utilisateur.

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

## Conv

### Toutes les donnees d'une conv

```http
  GET /conv/${id}
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| id | int | Valeur de l'identifiant de la conversation |

#### Return;

Renvoi un JSON ([Details](##JSON-Conv-1))avec toutes les donnees liee a une conv, les messages, les utilisateurs, les admins, les muteds,... 

```JSON
{
    "ID": 1,
    "Name": "Conversation 1",
    "Status": 1,
    "Password": null,
    "Messages": [
        {
            "data": "Salut User2, comment ça va ?",
            "ID_user": 1,
            "Logged_at": "2023-07-28T12:00:00"
        },
        {
            "data": "Salut User1, ça va bien merci ! Et toi ?",
            "ID_user": 2,
            "Logged_at": "2023-07-28T12:05:00"
        },
        {
            "data": "Je vais bien aussi, merci ! Que fais-tu aujourd'hui ?",
            "ID_user": 1,
            "Logged_at": "2023-07-28T12:10:00"
        }
    ],
    "Admin": [
        {
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
        }
    ],
    "Users": [
        {
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
        {
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
    ],
    "Muted": []
}
```

-----------
-----------

### Toutes les conv pour un utilisateur

```http
  GET /conv/${id}/user
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| id | int | Valeur de l'identifiant de l'utilisateur |

#### Return 

Renvoit un JSON contenant les infos basiques de toutes les convs voir [details](##JSON-Conv-2)
 
```JSON
[
    {
        "ID": 1,
        "Name": "Conversation 1",
        "Status": 1,
        "Password": null
    },
    {
        "ID": 3,
        "Name": "Conversation 1",
        "Status": 1,
        "Password": null
    }
]
```

-----------
-----------

### Banni un utilisateur d'une conv

```http
  GET /conv/:id/banned/:bannedId
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| id | int | Valeur de l'identifiant de l'utilisateur |


-----------
-----------

### Ajoute un utilisateur a une conv

```http
  GET /conv/:id/users/:idUser
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| id | int | Valeur de l'identifiant de l'utilisateur |

#### Return:
Renvoi un JSON avec les donnees mise a jour voir [Details](##JSON-Conv-1)

-----------
-----------

### Ajoute un utilisateur en tant qu'admin

```http
  GET /conv/:id/admins/:idAdmin
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| id | int | Valeur de l'identifiant de l'utilisateur |

#### Return:
Renvoi un JSON avec les donnees mise a jour voir [Details](##JSON-Conv-1)

-----------
-----------

### Ajoute un utilisateur en tant que mute

```http
  GET /conv/:id/muteds/:idMuted
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| id | int | Valeur de l'identifiant de l'utilisateur |

#### Return:
Renvoi un JSON avec les donnees mise a jour voir [Details](##JSON-Conv-1)

-----------
-----------

### Ajoute un message dans une conv

```http
  POST /conv/:id/message
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| id | int | Valeur de l'identifiant de l'utilisateur |

#### Return:
Renvoi un JSON avec les donnees mise a jour voir [Details](##JSON-Conv-1)

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


## JSON Conv 1

```JSON
{
    "ID": 1,
    "Name": "Conversation 1",
    "Status": 1,
    "Password": null,
    "Messages": [
        {
            "data": "Salut User2, comment ça va ?",
            "ID_user": 1,
            "Logged_at": "2023-07-28T12:00:00"
        },
        {
            "data": "Salut User1, ça va bien merci ! Et toi ?",
            "ID_user": 2,
            "Logged_at": "2023-07-28T12:05:00"
        },
        {
            "data": "Je vais bien aussi, merci ! Que fais-tu aujourd'hui ?",
            "ID_user": 1,
            "Logged_at": "2023-07-28T12:10:00"
        }
    ],
    "Admin": [...],
    "Users": [...],
    "Muted": [...]
}
```
- ID vaut l'identifiant de la conv
- Name est le nom de la conversation
- Status permet de savoir de qu'elle type de conv il s'agit
  - 0 = conv de groupe public
  - 1 = conv de groupe avec mot de passe
  - 2 = conv duo
- Password, utile si on a un status 1
- Messages est une liste de tous les messages
- Admins, Users et Muted sont des listes contenant de utilisateurs voir [Details](##JSON-User-1)

## JSON Conv 2

```JSON
[
    {
        "ID": 1,
        "Name": "Conversation 1",
        "Status": 1,
        "Password": null
    },
    {
        "ID": 3,
        "Name": "Conversation 1",
        "Status": 1,
        "Password": null
    }
]
```

Listes composee de :
- ID de la conv
- Nom de la conv
- Status de la conv
  - 0 = conv de groupe public
  - 1 = conv de groupe avec mot de passe
  - 2 = conv duo
- Password, utile si on a un status 1