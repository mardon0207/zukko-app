import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../utils/supabase';
import { generateQuestionSet } from '../utils/generator';

const RANKS = [
  { id: 'student', min: 0, level: 1 },
  { id: 'undergrad', min: 2000, level: 2 },
  { id: 'master', min: 8000, level: 3 },
  { id: 'aspirant', min: 18000, level: 4 },
  { id: 'doctor', min: 35000, level: 5 },
  { id: 'professor', min: 60000, level: 5 }
];

export const useGameLogic = (subject, globalMistakes, subjectStats, onUpdateMistakes, onGameOver) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [questions, setQuestions] = useState([]);
  const [lives, setLives] = useState(3);
  const [timeLeft, setTimeLeft] = useState(15);
  const [isLoading, setIsLoading] = useState(true);
  const [isGameOver, setIsGameOver] = useState(false);
  const [isShaking, setIsShaking] = useState(false);
  
  // Lifelines and Mascot
  const [mascotState, setMascotState] = useState('neutral');
  const [isFrozen, setIsFrozen] = useState(false);
  const [usedLifelines, setUsedLifelines] = useState({ half: false });
  const [hiddenOptions, setHiddenOptions] = useState([]);
  const [results, setResults] = useState([]); // Array of booleans or nulls

  useEffect(() => {
    let isMounted = true;

    const loadQuestions = async () => {
      if (!subject) return;
      setIsLoading(true);
      
      try {
        let rawQuestions = [];
        if (subject === 'mistakes') {
          rawQuestions = globalMistakes || [];
        } else {
          const subjPoints = (subjectStats && subjectStats[subject]) || 0;
          const rank = [...RANKS].reverse().find(r => subjPoints >= r.min) || RANKS[0];
          
          const { data, error } = await supabase
            .from('questions')
            .select('*')
            .eq('subject', subject)
            .eq('level', rank.level);
          
          if (data) rawQuestions = data;
        }

        if (isMounted) {
          const selectedQuestions = generateQuestionSet(rawQuestions, 10);
          
          setQuestions(selectedQuestions);
          setResults(new Array(selectedQuestions.length).fill(null));
          setCurrentQuestionIndex(0);
          setScore(0);
          setStreak(0);
          setTimeLeft(15);
          setIsGameOver(false);
          setLives(3);
          setMascotState('neutral');
          setIsFrozen(false);
          setHiddenOptions([]);
        }
      } catch (error) {
        console.error("Generator Error:", error);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    loadQuestions();
    return () => { isMounted = false; };
  }, [subject]);

  useEffect(() => {
    if (timeLeft > 0 && !isGameOver && !isLoading && !isFrozen && questions.length > 0) {
      const timer = setTimeout(() => setTimeLeft(prev => prev - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && !isGameOver && !isLoading && questions.length > 0) {
      handleAnswer(null);
    }
  }, [timeLeft, isGameOver, isLoading, isFrozen, questions.length]);

  const useLifeline = (type) => {
    if (type === 'half' && !usedLifelines.half && questions[currentQuestionIndex]) {
      const q = questions[currentQuestionIndex];
      const wrongIndices = q.options
        .map((opt, i) => opt !== q.answer ? i : -1)
        .filter(i => i !== -1);
      const toHide = wrongIndices.sort(() => 0.5 - Math.random()).slice(0, 2);
      setHiddenOptions(toHide);
      setUsedLifelines(prev => ({ ...prev, half: true }));
    }
  };

  const activateFreeze = () => setIsFrozen(true);

  const handleAnswer = useCallback((selectedOption) => {
    if (isGameOver || isLoading || questions.length === 0) return false;

    const currentQuestion = questions[currentQuestionIndex];
    if (!currentQuestion) return false;

    const isCorrect = selectedOption?.toString().trim() === currentQuestion.answer?.toString().trim();
    
    // Update results array
    setResults(prev => {
      const newResults = [...prev];
      newResults[currentQuestionIndex] = isCorrect;
      return newResults;
    });

    setIsFrozen(false);
    setHiddenOptions([]);

    if (isCorrect) {
      setScore(prev => prev + (timeLeft * 2));
      setStreak(prev => prev + 1);
      setMascotState('happy');
      
      if (subject === 'mistakes') {
        const newMistakes = globalMistakes.filter(m => !(m.id === currentQuestion.id && m.subject === currentQuestion.subject));
        if (newMistakes.length !== globalMistakes.length) {
          onUpdateMistakes(newMistakes);
        }
      }
    } else {
      setStreak(0);
      setLives(prev => prev - 1);
      setIsShaking(true);
      setMascotState('sad');
      setTimeout(() => setIsShaking(false), 500);
      
      if (subject !== 'mistakes') {
        const alreadyExists = globalMistakes.find(m => m.id === currentQuestion.id && m.subject === currentQuestion.subject);
        if (!alreadyExists) {
          const newMistakes = [...globalMistakes, { ...currentQuestion, subject }];
          onUpdateMistakes(newMistakes);
        }
      }
    }

    // Delay the transition to let GameView finish its animation/highlighting
    setTimeout(() => {
      if (lives <= (isCorrect ? 0 : 1)) {
        setIsGameOver(true);
        onGameOver(score + (isCorrect ? timeLeft * 2 : 0), streak + (isCorrect ? 1 : 0));
      } else if (currentQuestionIndex + 1 < questions.length) {
        setCurrentQuestionIndex(prev => prev + 1);
        setTimeLeft(15);
        setMascotState('neutral');
      } else {
        setIsGameOver(true);
        onGameOver(score + (isCorrect ? timeLeft * 2 : 0), streak + (isCorrect ? 1 : 0));
      }
    }, 1200);

    return isCorrect;
  }, [currentQuestionIndex, questions, isGameOver, isLoading, timeLeft, score, streak, lives, subject, onGameOver]);

  return {
    currentQuestion: questions[currentQuestionIndex],
    currentQuestionIndex,
    totalQuestions: questions.length,
    score, streak, lives, timeLeft, mascotState, isFrozen, 
    handleAnswer, useLifeline, usedLifelines, hiddenOptions,
    activateFreeze, setLives, isShaking, isLoading, results,
    progress: (currentQuestionIndex / (questions.length || 1)) * 100
  };
};
