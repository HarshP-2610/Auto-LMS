const FinalAssessment = require('../models/FinalAssessment');
const CompletedFinalAssessment = require('../models/CompletedFinalAssessment');
const Progress = require('../models/Progress');

exports.getFinalAssessment = async (req, res) => {
    try {
        const { courseId } = req.query;
        if (!courseId) return res.status(400).json({ message: 'courseId is required' });

        const assessment = await FinalAssessment.findOne({ course: courseId }).populate('course', 'title');
        res.json(assessment);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching final assessment', error });
    }
};

exports.getFinalAssessmentById = async (req, res) => {
    try {
        const assessment = await FinalAssessment.findById(req.params.id).populate('course', 'title');
        if (!assessment) return res.status(404).json({ message: 'Final assessment not found' });
        res.json(assessment);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching final assessment', error });
    }
};

exports.createOrUpdateFinalAssessment = async (req, res) => {
    try {
        const { title, course, duration, passingMarks, questions } = req.body;

        // Find existing to check instructor match if it exists
        let assessment = await FinalAssessment.findOne({ course });

        if (assessment) {
            if (assessment.instructor.toString() !== req.user._id.toString()) {
                return res.status(403).json({ message: 'Not authorized' });
            }
            assessment.title = title;
            assessment.duration = duration;
            assessment.passingMarks = passingMarks;
            assessment.questions = questions;
            await assessment.save();
        } else {
            assessment = new FinalAssessment({
                title,
                course,
                instructor: req.user._id,
                duration,
                passingMarks,
                questions
            });
            await assessment.save();
        }

        const populated = await FinalAssessment.findById(assessment._id).populate('course', 'title');
        res.status(200).json(populated);
    } catch (error) {
        res.status(500).json({ message: 'Error saving final assessment', error });
    }
};

exports.submitFinalAssessment = async (req, res) => {
    try {
        const { assessmentId, answers: userAnswers } = req.body;
        const assessment = await FinalAssessment.findById(assessmentId);
        if (!assessment) return res.status(404).json({ message: 'Final assessment not found' });

        let correctCount = 0;
        const answersToSave = assessment.questions.map((q) => {
            const selectedOption = userAnswers[q._id];
            const isCorrect = selectedOption === q.correctOptionIndex;
            if (isCorrect) correctCount++;
            return {
                questionId: q._id,
                selectedOption,
                isCorrect
            };
        });

        const score = Math.round((correctCount / assessment.questions.length) * 100);
        const passed = score >= assessment.passingMarks;

        // Count previous attempts for retake tracking
        const previousAttempts = await CompletedFinalAssessment.countDocuments({
            user: req.user._id,
            finalAssessment: assessmentId
        });

        const completed = new CompletedFinalAssessment({
            user: req.user._id,
            finalAssessment: assessmentId,
            course: assessment.course,
            score,
            totalQuestions: assessment.questions.length,
            correctAnswers: correctCount,
            passed,
            retakeCount: previousAttempts,
            answers: answersToSave
        });

        await completed.save();

        if (passed) {
            await Progress.findOneAndUpdate(
                { user: req.user._id, course: assessment.course },
                {
                    $set: {
                        isCompleted: true,
                        completionDate: new Date(),
                        percentComplete: 100
                    }
                }
            );
        }

        res.status(201).json(completed);
    } catch (error) {
        console.error('Submit Final Assessment Error:', error);
        res.status(500).json({ message: 'Error submitting final assessment', error: error.message });
    }
};

exports.getFinalResults = async (req, res) => {
    try {
        const results = await CompletedFinalAssessment.find({ user: req.user._id })
            .populate('finalAssessment', 'title')
            .populate('course', 'title')
            .sort({ createdAt: -1 });
        res.json(results);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching final results', error });
    }
};

exports.getFinalResultDetails = async (req, res) => {
    try {
        const result = await CompletedFinalAssessment.findOne({ _id: req.params.id, user: req.user._id })
            .populate('finalAssessment')
            .populate('course', 'title');

        if (!result) return res.status(404).json({ message: 'Result not found' });

        const mappedResult = result.toObject();
        // Rename for frontend compatibility
        mappedResult.quiz = mappedResult.finalAssessment;

        res.json(mappedResult);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching result', error });
    }
};

exports.getAllFinalAssessments = async (req, res) => {
    try {
        const query = req.user.role === 'admin' ? {} : { instructor: req.user._id };
        const assessments = await FinalAssessment.find(query).populate('course', 'title');
        res.json(assessments);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching final assessments', error });
    }
};

exports.deleteFinalAssessment = async (req, res) => {
    try {
        const deleted = await FinalAssessment.findOneAndDelete({ _id: req.params.id, instructor: req.user._id });
        if (!deleted) return res.status(404).json({ message: 'Assessment not found' });
        res.json({ message: 'Final assessment deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting assessment', error });
    }
};
