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
    name: {
        type: String,
        required: 'Please include the agent name.'
    },
    task: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Task'
    }
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } });

module.exports = mongoose.model('Agents', AgentSchema);