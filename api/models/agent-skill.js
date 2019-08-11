'use strict';

const mongoose = require('mongoose');
mongoose.set('useCreateIndex', true);
const Schema = mongoose.Schema;
const _ = require('lodash');

//note skills are a static list for simplicity, these could be moved into db once they become dynamic
const Skills = Object.freeze({
    Skill1: 'skill1',
    Skill2: 'skill2',
    Skill3: 'skill3',
  });

var SkillSchema = new Schema({
    value: {
        type: String,
        enum: _.values(Skills)
      }
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } });


Object.assign(SkillSchema.statics, { Skills });

module.exports = mongoose.model('AgentSkill', SkillSchema);