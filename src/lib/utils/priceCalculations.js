// src/lib/utils/priceCalculations.js

/**
 * Linear regression for price prediction
 */
function linearRegression(data) {
  const n = data.length;
  let sumX = 0, sumY = 0, sumXY = 0, sumX2 = 0;
  
  data.forEach((point, index) => {
    sumX += index;
    sumY += point.price;
    sumXY += index * point.price;
    sumX2 += index * index;
  });
  
  const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
  const intercept = (sumY - slope * sumX) / n;
  
  return { slope, intercept };
}

/**
 * Calculate moving average
 */
export function calculateMovingAverage(data, windowSize = 3) {
  const result = [];
  
  for (let i = 0; i < data.length; i++) {
    if (i < windowSize - 1) {
      result.push(data[i]);
      continue;
    }
    
    const window = data.slice(i - windowSize + 1, i + 1);
    const avg = window.reduce((sum, item) => sum + item.price, 0) / windowSize;
    
    result.push({
      ...data[i],
      movingAverage: avg
    });
  }
  
  return result;
}

/**
 * Predict future prices using linear regression
 */
export function predictPrices(historicalData, daysToPredict = 30) {
  if (!historicalData || historicalData.length < 3) {
    return [];
  }
  
  // Use linear regression
  const { slope, intercept } = linearRegression(historicalData);
  
  // Calculate volatility for confidence intervals
  const volatility = calculateVolatility(historicalData);
  
  const predictions = [];
  const lastDate = new Date(historicalData[historicalData.length - 1].date);
  
  for (let i = 1; i <= daysToPredict; i++) {
    const futureDate = new Date(lastDate);
    futureDate.setDate(futureDate.getDate() + i);
    
    const predictedPrice = slope * (historicalData.length + i) + intercept;
    
    // Add some randomness based on historical volatility
    const noise = (Math.random() - 0.5) * volatility * 0.1;
    
    predictions.push({
      date: futureDate.toISOString().split('T')[0],
      price: Math.max(0, predictedPrice + noise),
      predicted: true,
      upperBound: predictedPrice + volatility * 1.5,
      lowerBound: Math.max(0, predictedPrice - volatility * 1.5)
    });
  }
  
  return predictions;
}

/**
 * Calculate volatility (standard deviation)
 */
export function calculateVolatility(priceArray) {
  if (!priceArray || priceArray.length === 0) return 0;
  
  const prices = priceArray.map(item => item.price);
  const avg = prices.reduce((sum, price) => sum + price, 0) / prices.length;
  const squaredDiffs = prices.map(price => Math.pow(price - avg, 2));
  const variance = squaredDiffs.reduce((sum, val) => sum + val, 0) / prices.length;
  
  return Math.sqrt(variance);
}

/**
 * Calculate price change statistics
 */
export function calculatePriceStats(data) {
  if (!data || data.length < 2) {
    return {
      average: 0,
      min: 0,
      max: 0,
      volatility: 0,
      trend: 0,
      changePercent: 0
    };
  }
  
  const prices = data.map(item => item.price);
  const average = prices.reduce((sum, price) => sum + price, 0) / prices.length;
  const min = Math.min(...prices);
  const max = Math.max(...prices);
  const volatility = calculateVolatility(data);
  
  // Calculate trend (positive = upward, negative = downward)
  const firstPrice = data[0].price;
  const lastPrice = data[data.length - 1].price;
  const trend = lastPrice - firstPrice;
  const changePercent = ((lastPrice - firstPrice) / firstPrice) * 100;
  
  return {
    average: parseFloat(average.toFixed(2)),
    min: parseFloat(min.toFixed(2)),
    max: parseFloat(max.toFixed(2)),
    volatility: parseFloat(volatility.toFixed(2)),
    trend: parseFloat(trend.toFixed(2)),
    changePercent: parseFloat(changePercent.toFixed(2))
  };
}

/**
 * Correlate fuel prices with crude oil prices
 */
export function calculateCorrelation(fuelPrices, crudePrices) {
  if (!fuelPrices || !crudePrices || fuelPrices.length === 0 || crudePrices.length === 0) {
    return 0;
  }
  
  // Align dates
  const commonDates = fuelPrices
    .map(fp => fp.date)
    .filter(date => crudePrices.some(cp => cp.date === date));
  
  if (commonDates.length < 2) return 0;
  
  const fuelValues = commonDates.map(date => 
    fuelPrices.find(fp => fp.date === date).price
  );
  
  const crudeValues = commonDates.map(date =>
    crudePrices.find(cp => cp.date === date).price
  );
  
  // Calculate correlation coefficient
  const n = fuelValues.length;
  const sumFuel = fuelValues.reduce((a, b) => a + b, 0);
  const sumCrude = crudeValues.reduce((a, b) => a + b, 0);
  const sumFuelCrude = fuelValues.reduce((sum, val, i) => sum + val * crudeValues[i], 0);
  const sumFuel2 = fuelValues.reduce((sum, val) => sum + val * val, 0);
  const sumCrude2 = crudeValues.reduce((sum, val) => sum + val * val, 0);
  
  const numerator = n * sumFuelCrude - sumFuel * sumCrude;
  const denominator = Math.sqrt(
    (n * sumFuel2 - sumFuel * sumFuel) * (n * sumCrude2 - sumCrude * sumCrude)
  );
  
  return denominator === 0 ? 0 : parseFloat((numerator / denominator).toFixed(2));
}

/**
 * Get price trend description
 */
export function getTrendDescription(trend) {
  if (trend > 2) return { text: 'Strong Upward', color: 'red' };
  if (trend > 0.5) return { text: 'Slight Upward', color: 'orange' };
  if (trend < -2) return { text: 'Strong Downward', color: 'green' };
  if (trend < -0.5) return { text: 'Slight Downward', color: 'lightgreen' };
  return { text: 'Stable', color: 'blue' };
}

/**
 * Format date for display
 */
export function formatDate(dateString, format = 'short') {
  const date = new Date(dateString);
  
  if (format === 'short') {
    return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  }
  
  if (format === 'full') {
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  }
  
  return dateString;
}