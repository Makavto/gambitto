'use strict';

const { GAME_TYPES } = require('../constants');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    // 1. Создание таблицы gameTypes
    await queryInterface.createTable('gameTypes', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
      },
      type: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },
      typeFormatted: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });

    // 2. Добавление внешнего ключа в chessGames
    await queryInterface.addColumn('chessGames', 'gameTypeId', {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: 'gameTypes',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    });

    // 3. Вставка типов игр из constants.js
    const gameTypesWithTimestamps = GAME_TYPES.map(type => ({
      ...type,
      createdAt: new Date(),
      updatedAt: new Date()
    }));

    await queryInterface.bulkInsert('gameTypes', gameTypesWithTimestamps);

    // 4. Установка значения gameTypeId в существующие chessGames
    // Устанавливаем rating (id = 1) как тип по умолчанию для существующих игр
    await queryInterface.sequelize.query(`
      UPDATE "chessGames" SET "gameTypeId" = 1
    `);
  },

  async down (queryInterface, Sequelize) {
    // 1. Удаление внешнего ключа из chessGames
    await queryInterface.removeColumn('chessGames', 'gameTypeId');
    
    // 2. Удаление таблицы gameTypes
    await queryInterface.dropTable('gameTypes');
  }
};
