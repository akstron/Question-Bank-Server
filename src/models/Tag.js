const sequelize = require('../config/db');
const {DataTypes: types, QueryTypes, Op} = require("sequelize");

const Tag = sequelize.define('Tag', {
    id: {
        type: types.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },

    name: {
        type: types.STRING(30),
        allowNull: false,
        unique: true
    }
}, {
    timestamps: false
});

/**
 * Add tag to database using this method
 */
Tag.addTag = async (tag) => {
    const alreadyTag = await Tag.findOne({
        where: {
            name: tag
        }
    });

    if(alreadyTag){
        throw ({
            status: 400, 
            error: 'Tag already exist'
        });
    }

    const dbTag = await Tag.create({
        name: tag
    });

    return dbTag;
}

/**
 * Get tag ids from tag names. 
 * WARNING: It creates tags when tag not found!!!
 */

Tag.getTagIds = async (tags) => {
    if(!tags) return [];

    const tagIds = [];
    for(var i =0 ; i < tags.length; i++){
        const tagId = await Tag.findOne({
            attributes: [
                'id'
            ],

            where: {
                name: tags[i]
            }
        });

        if(tagId) tagIds.push(tagId.id);
        else{
            try{
                const currentTag = await Tag.addTag(tags[i]);
                tagIds.push(currentTag.id);
            }
            catch(e){
                console.log(e);
            }
        }
    }

    return tagIds;
}

Tag.getTaggedQuestions = async (tags = [], user, offset = 0, limit = 5) => {
    if(tags.length === 0) return [];

return sequelize.query(`select q.id, q.url, q.name, q.difficulty, q.description, \
array_agg(t2.name) as tags from "Questions" as q INNER JOIN "TagMaps" as t1 \
ON q.id = t1."QuestionId" INNER JOIN "Tags" as t2 on t1."TagId" = t2.id \
where "UserId" = :UserId AND EXISTS (SELECT DISTINCT q.id FROM "Questions" \
INNER JOIN "TagMaps" as t1 on q.id = t1."QuestionId" INNER JOIN "Tags" as t2 on t1."TagId" = t2.id \
WHERE "UserId" = :UserId AND t2.name IN (:tags)) GROUP BY q.id, \
q.url, q.difficulty, q.description LIMIT :limit OFFSET :offset;`, {
    replacements:  {limit, UserId: user.id, offset: offset, tags},
    type: QueryTypes.SELECT
});
}

Tag.getSearchTags = async (searchText, limit = 5) => {
    if(!searchText){
        throw{
            status: false,
            error: 'Search text missing'
        }
    }

    const tags = await Tag.findAll({
        where:{
            name: {
                [Op.like] : '%' + searchText + '%'
            }
        }, 
        limit
    });

    return tags;
}

Tag.sync().then(() => {
    console.log('Tag synced successfully');
}).catch((e) => console.log(e));

module.exports = Tag;