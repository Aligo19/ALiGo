## Explicatifs

Travail en date du 21 juin

Nous reprenons donc la magie des dockers.

Pour l'instant, il n'heberge qu'une DB et adminer qui permet d'interagir avec la DB. A terme, un autre serveur en NestJS fera l'interface API pour le site principal.

Le schema de DB est repris sur le Notion du groupe

--------
Liste des commandes du Makefile avec effets

| Commande make | Action | Etat |
| ------ | ------ | ------ |
| make | Genere le docker et l'execute| Cache |
| make build | Genere le docker | Cache |
| make up | Execute le docker | Cache |
| make down | Eteint le docker | Visible |
| make pause | Met le docker en pause | Visible |
| make unpause | Reactive le docker | Visible |
| make clean | Efface les dockers | |Visible 
| make fclean | Efface les volumes des dockers, les reseauz et les images| Visible |



Voici la Db
La table users possede
ID
Pseudo en string
Avatar en String

La table Fields possede
ID
name en String

La table conv possede
Id 
name en string

La table DatasUser possede
ID
Id_user lie a la table users
data
Id_field lie a la table fields
logged_at en date

La table matchs possede
Id
Id_user1 lie a la table user
Id_user2 lie a la table user
score_u1 en int
score_u2 en int
level en int

La table DataConv possede
ID
Id_conv lie a conv
data en string
Id_field lie a fields
logged_at en date

La table DataMess possede
Id 
ID_conv lie a conv
data en string
Id_user lie a user
logged_at en date


@Method(':id')
async function(@Param('id') id: string) {
    let output = {};
    let logger = "";
    try {
        ...
    logger = 'MatchController getMatch: ' + id;
    output = match;
    } catch (error) {
    logger = 'MatchController getMatch: ' + id + ' // Error in request';
    output = {error: 'The request failed'};
    }
    Logger.log(logger, 'Request GET');
    return  JSON.stringify(output);
}