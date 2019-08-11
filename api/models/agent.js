'use strict';

const mongoose = require('mongoose');
mongoose.set('useCreateIndex', true);
const Schema = mongoose.Schema;

var AgentSchema = new Schema({
    id: {
        type: String,
        required: 'Please include the agent identifier.',
        unique: true,
        dropDups: true
    },
    skills: {
        type: [{
            type: Schema.Types.ObjectId,
            ref: 'AgentSkill'
        }]
      },
    task: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Task'
    }
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } });

AgentSchema.virtual('hasNoTask').get(function() { return this.task == null; });

module.exports = mongoose.model('Agents', AgentSchema);