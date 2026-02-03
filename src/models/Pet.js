module.exports = (sequelize, DataTypes) => {
  const Pet = sequelize.define(
    "Pet",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      species: {
        type: DataTypes.ENUM("dog", "cat"),
        allowNull: false,
      },
      breed: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      age: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      status: {
        type: DataTypes.ENUM("available", "adopted", "lost"),
        defaultValue: "available",
      },

      // ✅ NOVO (seguro): ONG dona do pet
      // allowNull: true para não quebrar dados existentes
      ongId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        // (opcional agora) references só quando a tabela ongs existir no banco de todos
        // references: { model: "ongs", key: "id" },
      },

      // ✅ MANTER por enquanto para compatibilidade com o que já existe
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "users",
          key: "id",
        },
      },
    },
    {
      tableName: "pets",
      timestamps: true,
    }
  );

  Pet.associate = (models) => {
    // Quando o model Ong existir e a tabela ongs estiver criada:
    if (models.Ong) {
      Pet.belongsTo(models.Ong, { foreignKey: "ongId" });
    }

    // Se vocês tiverem User model carregado no loader também:
    if (models.User) {
      Pet.belongsTo(models.User, { foreignKey: "userId" });
    }
  };

  return Pet;
};
