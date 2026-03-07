const express = require('express');
const router = express.Router();
const {
    getFinalAssessment,
    getFinalAssessmentById,
    createOrUpdateFinalAssessment,
    submitFinalAssessment,
    getFinalResults,
    getFinalResultDetails,
    getAllFinalAssessments,
    deleteFinalAssessment
} = require('../controllers/finalAssessmentController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.get('/', getFinalAssessment);
router.get('/all', getAllFinalAssessments);
router.get('/results', getFinalResults);
router.get('/completed/details/:id', getFinalResultDetails);
router.get('/:id', getFinalAssessmentById);
router.post('/submit', submitFinalAssessment);
router.post('/', createOrUpdateFinalAssessment);
router.delete('/:id', deleteFinalAssessment);

module.exports = router;
