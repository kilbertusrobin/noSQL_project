const Profile = require('./models/profile');

const getAllProfiles = async (req, res) => {
    try {
        const query = { deleted: false };
        
        if (req.query.skills) {
            const skillsArray = req.query.skills.split(',');
            query.skills = { $in: skillsArray };
        }
        
        if (req.query.location) {
            query['information.location'] = { $regex: req.query.location, $options: 'i' };
        }
        
        if (req.query.name) {
            query.name = { $regex: req.query.name, $options: 'i' };
        }
        
        if (req.query.email) {
            query.email = { $regex: req.query.email, $options: 'i' };
        }
        
        if (req.query.company) {
            query['experiences.company'] = { $regex: req.query.company, $options: 'i' };
        }
        
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;
        
        const sort = {};
        if (req.query.sort) {
            const parts = req.query.sort.split(':');
            sort[parts[0]] = parts[1] === 'desc' ? -1 : 1;
        }
        
        const profiles = await Profile.find(query)
            .sort(sort)
            .skip(skip)
            .limit(limit);
            
        const total = await Profile.countDocuments(query);
        
        res.json({
            profiles,
            pagination: {
                total,
                page,
                pages: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getProfileById = async (req, res) => {
    try {
        const profile = await Profile.findById(req.params.id);
        if (profile && !profile.deleted) {
            res.json(profile);
        } else {
            res.status(404).json({ message: 'Profile not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const createProfile = async (req, res) => {
    try {
        const { name, email } = req.body;
        const newProfile = new Profile({
            name,
            email,
            experiences: [],
            skills: [],
            information: {},
            deleted: false
        });
        
        const savedProfile = await newProfile.save();
        res.status(201).json(savedProfile);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const updateProfile = async (req, res) => {
    try {
        const { name, email } = req.body;
        const profile = await Profile.findByIdAndUpdate(
            req.params.id,
            { name, email },
            { new: true }
        );
        
        if (profile && !profile.deleted) {
            res.json(profile);
        } else {
            res.status(404).json({ message: 'Profile not found' });
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const deleteProfile = async (req, res) => {
    try {
        const profile = await Profile.findByIdAndUpdate(
            req.params.id,
            { deleted: true },
            { new: true }
        );
        
        if (profile) {
            res.json({ message: 'Profile deleted successfully' });
        } else {
            res.status(404).json({ message: 'Profile not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const addExperience = async (req, res) => {
    try {
        const { title, company, startDate, endDate, description } = req.body.experience;
        
        const profile = await Profile.findById(req.params.id);
        if (profile && !profile.deleted) {
            profile.experiences.push({
                title,
                company,
                startDate,
                endDate,
                description
            });
            
            const updatedProfile = await profile.save();
            res.json(updatedProfile);
        } else {
            res.status(404).json({ message: 'Profile not found' });
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const deleteExperience = async (req, res) => {
    try {
        const profile = await Profile.findById(req.params.id);
        if (profile && !profile.deleted) {
            profile.experiences = profile.experiences.filter(
                exp => exp._id.toString() !== req.params.exp
            );
            
            const updatedProfile = await profile.save();
            res.json(updatedProfile);
        } else {
            res.status(404).json({ message: 'Profile not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
const addSkill = async (req, res) => {
    try {
        const { skill } = req.body;

        const profile = await Profile.findOneAndUpdate(
            { _id: req.params.id, deleted: false, skills: { $ne: skill } },
            { $push: { skills: skill } },
            { new: true }
        );

        if (profile) {
            res.json(profile);
        } else {
            res.status(400).json({ message: 'Profile not found or skill already exists' });
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const deleteSkill = async (req, res) => {
    try {
        const profile = await Profile.findById(req.params.id);
        if (profile && !profile.deleted) {
            profile.skills = profile.skills.filter(s => s !== req.params.skill);
            
            const updatedProfile = await profile.save();
            res.json(updatedProfile);
        } else {
            res.status(404).json({ message: 'Profile not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateInformation = async (req, res) => {
    try {
        const { information } = req.body;
        
        const profile = await Profile.findByIdAndUpdate(
            req.params.id,
            { information },
            { new: true }
        );
        
        if (profile && !profile.deleted) {
            res.json(profile);
        } else {
            res.status(404).json({ message: 'Profile not found' });
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

module.exports = {
    getAllProfiles,
    getProfileById,
    createProfile,
    updateProfile,
    deleteProfile,
    addExperience,
    deleteExperience,
    addSkill,
    deleteSkill,
    updateInformation
};