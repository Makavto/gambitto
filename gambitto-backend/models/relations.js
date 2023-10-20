const models = require('./index');

module.exports = () => {
    models.User.belongsToMany(models.User, { through: models.Friendship, as: 'friendOne', foreignKey: 'friendOneId' });
    models.User.belongsToMany(models.User, { through: models.Friendship, as: 'friendTwo', foreignKey: 'friendTwoId' });
    models.User.belongsToMany(models.User, {through: models.Chat, as: 'userOne', foreignKey: 'userOneId' });
    models.User.belongsToMany(models.User, {through: models.Chat, as: 'userTwo', foreignKey: 'userTwoId' });
    models.User.belongsToMany(models.User, {through: models.ChessGame, as: 'blackPlayer', foreignKey: 'blackPlayerId' });
    models.User.belongsToMany(models.User, {through: models.ChessGame, as: 'whitePlayer', foreignKey: 'whitePlayerId' });
    models.User.hasMany(models.Message);
    models.User.hasMany(models.ChessMove);
    models.User.hasOne(models.Token);

    models.Chat.hasMany(models.Message);
    models.Chat.belongsTo(models.User, {as: 'userOne', onDelete: 'CASCADE'});
    models.Chat.belongsTo(models.User, {as: 'userTwo', onDelete: 'CASCADE'});

    models.Message.belongsTo(models.Chat);
    models.Message.belongsTo(models.User);

    models.ChessGame.belongsTo(models.GameStatus);
    models.ChessGame.hasMany(models.ChessMove);
    models.ChessGame.belongsTo(models.User, {as: 'blackPlayer', onDelete: 'CASCADE'});
    models.ChessGame.belongsTo(models.User, {as: 'whitePlayer', onDelete: 'CASCADE'});

    models.ChessMove.belongsTo(models.ChessGame);
    models.ChessMove.belongsTo(models.User);

    models.GameStatus.hasMany(models.ChessGame);

    models.Friendship.belongsTo(models.FriendshipStatus);
    models.Friendship.belongsTo(models.User, {as: 'friendOne', onDelete: 'CASCADE'});
    models.Friendship.belongsTo(models.User, {as: 'friendTwo', onDelete: 'CASCADE'});

    models.FriendshipStatus.hasMany(models.Friendship);

    models.Token.belongsTo(models.User);
}


