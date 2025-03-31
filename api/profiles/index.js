const express = require('express');
const router = express.Router();
const controllers = require('./controller');

router.get('/profiles', controllers.getAllProfiles);
router.get('/profiles/:id', controllers.getProfileById);
router.post('/profiles', controllers.createProfile);
router.put('/profiles/:id', controllers.updateProfile);
router.delete('/profiles/:id', controllers.deleteProfile);

router.post('/profiles/:id/experiences', controllers.addExperience);
router.delete('/profiles/:id/experiences/:exp', controllers.deleteExperience);

router.post('/profiles/:id/skills', controllers.addSkill);
router.delete('/profiles/:id/skills/:skill', controllers.deleteSkill);

router.put('/profiles/:id/information', controllers.updateInformation);

module.exports = router;