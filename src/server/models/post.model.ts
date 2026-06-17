import { type PostInfo } from '../../types';

import { DataTypes, Model, Optional } from 'sequelize';
import { db } from '../../db';

interface PostCreationAttributes extends Optional<PostInfo, 'id'> {}

class Post extends Model<PostInfo, PostCreationAttributes> {}

Post.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    last_post_id: {
      type: DataTypes.INTEGER,
      unique: false,
      allowNull: true,
    },
    channel_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
    },
  },
  {
    sequelize: db,
    modelName: 'Post',
    tableName: 'posts',
  }
);

export default Post;
