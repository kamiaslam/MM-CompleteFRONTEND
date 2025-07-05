export const expressionColors = {
  Admiration: "#ffc58f", // Soft orange
  Adoration: "#ffb3c6", // Light pink
  "Aesthetic Appreciation": "#d1c4e9", // Light purple
  Amusement: "#ffeb3b", // Bright yellow
  Anger: "#d32f2f", // Strong red (represents anger)
  Annoyance: "#ff9800", // Orange (annoyance)
  Anxiety: "#6a1b9a", // Deep purple
  Awe: "#7dabd3", // Light blue
  Awkwardness: "#cddc39", // Lime green
  Boredom: "#b0bec5", // Gray (neutral)
  Calmness: "#81c784", // Soft green (calm)
  Concentration: "#2979ff", // Bright blue (focused)
  Contemplation: "#673ab7", // Deep purple (thoughtful)
  Confusion: "#ff7043", // Orange-red (confused)
  Contempt: "#4caf50", // Green (contempt)
  Contentment: "#e1bee7", // Light purple
  Craving: "#8d6e63", // Brown (craving, earthy tone)
  Determination: "#ff5722", // Deep orange (driven)
  Disappointment: "#004d40", // Teal (sadness mixed with frustration)
  Disapproval: "#d32f2f", // Dark red (disapproval)
  Disgust: "#388e3c", // Strong green (disgust)
  Distress: "#f44336", // Bright red (distress)
  Doubt: "#8e24aa", // Purple (uncertainty)
  Ecstasy: "#ff4081", // Pink (joyful, excited)
  Embarrassment: "#f06292", // Pink (embarrassment)
  "Empathic Pain": "#c2185b", // Dark pink (empathy)
  Enthusiasm: "#ffeb3b", // Yellow (excited)
  Entrancement: "#673ab7", // Purple (entranced)
  Envy: "#388e3c", // Green (envy)
  Excitement: "#ffeb3b", // Bright yellow
  Fear: "#303f9f", // Dark blue (fearful)
  Gratitude: "#ffb74d", // Warm orange (grateful)
  Guilt: "#616161", // Gray (guilt, somber)
  Horror: "#6a1b9a", // Deep purple (horror)
  Interest: "#64b5f6", // Light blue (curious)
  Joy: "#ffd600", // Bright yellow (happiness)
  Love: "#e91e63", // Pink (love)
  Neutral: "#9e9e9e", // Gray (neutral emotion)
  Nostalgia: "#b39ddb", // Light purple (nostalgia)
  Pain: "#d32f2f", // Dark red (pain)
  Pride: "#9c27b0", // Purple (pride)
  Realization: "#00acc1", // Light blue (epiphany)
  Relief: "#81c784", // Green (relief)
  Romance: "#f48fb1", // Pink (romance)
  Sadness: "#303f9f", // Deep blue (sadness)
  Sarcasm: "#ffca28", // Yellow (playful, sarcastic)
  Satisfaction: "#66bb6a", // Green (satisfaction)
  "Sexual Desire": "#d81b60", // Red-pink (desire)
  Shame: "#8d6e63", // Brown (shame)
  Surprise: "#ffeb3b", // Bright yellow (surprise)
  "Surprise (negative)": "#ff7043", // Orange (negative surprise)
  "Surprise (positive)": "#7e57c2", // Purple (positive surprise)
  Sympathy: "#7f88e0", // Light blue (sympathy)
  Tiredness: "#757575", // Gray (tiredness)
  Triumph: "#ff5722", // Deep orange (triumph)
};

export const isExpressionColor = (color) => {
  return color in expressionColors;
};
