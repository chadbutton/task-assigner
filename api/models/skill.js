'use strict';

const mongoose = require('mongoose');
mongoose.set('useCreateIndex', true);
const Schema = mongoose.Schema;

var SkillSchema = new Schema({
    value: {
        type: String,
        enum: ['skill1', 'skill2', 'skill3']
      }
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } });

module.exports = mongoose.model('Skill', SkillSchema);