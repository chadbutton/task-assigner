'use strict';

const mongoose = require('mongoose');
mongoose.set('useCreateIndex', true);
const Schema = mongoose.Schema;

//note skills are a static list for simplicity, they could be moved into DB if they become dynamic
const Skills = Object.freeze({
    Skill1: 'skill1',
    Skill2: 'skill2',
    Skill3: 'skill3',
  });

var AgentSchema = new Schema({
    id: {
        type: String,
        required: 'Please include the agent identifier.',
        unique: true,
        dropDups: true
    },
    skills: [{
        //type: String
    }],
    task: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Task'
    }
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } });

Object.assign(AgentSchema.statics, { Skills });

AgentSchema.virtual('hasNoTask').get(function() { return this.task == null; });

module.exports = mongoose.model('Agents', AgentSchema);