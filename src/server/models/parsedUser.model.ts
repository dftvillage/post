import { type ParsedUserInfo } from '../../types';

import { DataTypes, Model, Optional } from 'sequelize';
import { db } from '../../db';

interface ParsedUserCreationAttributes extends Optional<ParsedUserInfo, 'id'> {}

class ParsedUser extends Model<ParsedUserInfo, ParsedUserCreationAttributes> {}

ParsedUser.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    telegram_id: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    langCode: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    accessHash: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    deleted: DataTypes.BOOLEAN,
    bot: DataTypes.BOOLEAN,
    verified: DataTypes.BOOLEAN,
    premium: DataTypes.BOOLEAN,
    support: DataTypes.BOOLEAN,
    invite_status: {
      type: DataTypes.ENUM('pending', 'invited', 'privacy_restricted', 'flood_wait', 'failed'),
      defaultValue: 'pending',
    },
  },
  {
    sequelize: db,
    modelName: 'ParsedUser',
    tableName: 'parsed_user',
  }
);

export default ParsedUser;
