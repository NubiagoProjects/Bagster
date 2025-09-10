import { BagsterSDK, SmartSelectionCriteria } from '../bagster-js-sdk';

// Initialize SDK
const sdk = new BagsterSDK({
  apiKey: 'your-api-key-here',
  baseUrl: 'http://localhost:3000' // or your production URL
});

/**
 * Example 1: Basic Smart Selection (Balanced)
 * Balances price, rating, and destination coverage
 */
export async function exampleBalancedSelection() {
  console.log('🎯 Example 1: Balanced Carrier Selection');
  
  try {
    const result = await sdk.selectBestCarrier(
      'Lagos, Nigeria',
      'Abuja, Nigeria',
      5.0 // 5kg package
    );

    if (result.success && result.data) {
      const { selected_carrier, scoring_breakdown } = result.data;
      
      console.log('✅ Selected Carrier:', selected_carrier.name);
      console.log('💰 Cost:', `${selected_carrier.currency} ${selected_carrier.total_cost}`);
      console.log('⭐ Rating:', selected_carrier.rating);
      console.log('📦 Delivery Time:', selected_carrier.delivery_time);
      console.log('🎯 Selection Reason:', selected_carrier.selectionReason);
      console.log('📊 Scores:', {
        price: selected_carrier.priceScore,
        rating: selected_carrier.ratingScore,
        destination: selected_carrier.destinationScore,
        total: selected_carrier.totalScore
      });
      console.log('⚖️ Weights Used:', scoring_breakdown.weights_used);
    }
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

/**
 * Example 2: Cheapest Carrier Selection
 * Prioritizes lowest cost above all else
 */
export async function exampleCheapestSelection() {
  console.log('\n💸 Example 2: Cheapest Carrier Selection');
  
  try {
    const result = await sdk.getCheapestCarrier(
      'Port Harcourt, Nigeria',
      'Kano, Nigeria',
      10.0 // 10kg package
    );

    if (result.success && result.data) {
      const { selected_carrier, recommendations } = result.data;
      
      console.log('✅ Cheapest Carrier:', selected_carrier.name);
      console.log('💰 Cost:', `${selected_carrier.currency} ${selected_carrier.total_cost}`);
      console.log('⭐ Rating:', selected_carrier.rating);
      
      console.log('\n📋 Top 3 Recommendations:');
      recommendations.forEach((carrier, index) => {
        console.log(`${index + 1}. ${carrier.name} - ${carrier.currency} ${carrier.total_cost} (Score: ${carrier.totalScore})`);
      });
    }
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

/**
 * Example 3: Best Rated Carrier Selection
 * Prioritizes highest rating and service quality
 */
export async function exampleBestRatedSelection() {
  console.log('\n⭐ Example 3: Best Rated Carrier Selection');
  
  try {
    const result = await sdk.getBestRatedCarrier(
      'Ibadan, Nigeria',
      'Jos, Nigeria',
      2.5 // 2.5kg package
    );

    if (result.success && result.data) {
      const { selected_carrier, total_evaluated } = result.data;
      
      console.log('✅ Best Rated Carrier:', selected_carrier.name);
      console.log('⭐ Rating:', selected_carrier.rating);
      console.log('💰 Cost:', `${selected_carrier.currency} ${selected_carrier.total_cost}`);
      console.log('🚚 Services:', selected_carrier.services.join(', '));
      console.log('📊 Total Carriers Evaluated:', total_evaluated);
    }
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

/**
 * Example 4: Destination-Focused Selection
 * Prioritizes carriers specializing in specific destination countries
 */
export async function exampleDestinationFocusedSelection() {
  console.log('\n🌍 Example 4: Destination-Focused Selection');
  
  try {
    const result = await sdk.getDestinationOptimizedCarrier(
      'Lagos, Nigeria',
      'Accra, Ghana',
      7.0, // 7kg package
      'Ghana' // destination country
    );

    if (result.success && result.data) {
      const { selected_carrier, scoring_breakdown } = result.data;
      
      console.log('✅ Destination-Optimized Carrier:', selected_carrier.name);
      console.log('🌍 Delivery Countries:', selected_carrier.deliveryCountries.join(', '));
      console.log('💰 Cost:', `${selected_carrier.currency} ${selected_carrier.total_cost}`);
      console.log('⭐ Rating:', selected_carrier.rating);
      console.log('🎯 Why Selected:', scoring_breakdown.explanation);
    }
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

/**
 * Example 5: Custom Criteria Selection
 * Uses specific filters and requirements
 */
export async function exampleCustomCriteriaSelection() {
  console.log('\n🎛️ Example 5: Custom Criteria Selection');
  
  const customCriteria: SmartSelectionCriteria = {
    prioritize: 'balanced',
    max_price: 15000, // Maximum 15,000 NGN
    min_rating: 4.5,  // Minimum 4.5 stars
    required_services: ['insurance', 'tracking'],
    destination_country: 'Nigeria'
  };

  try {
    const result = await sdk.selectBestCarrier(
      'Enugu, Nigeria',
      'Calabar, Nigeria',
      3.0, // 3kg package
      customCriteria
    );

    if (result.success && result.data) {
      const { selected_carrier, selection_criteria } = result.data;
      
      console.log('✅ Custom Selected Carrier:', selected_carrier.name);
      console.log('💰 Cost:', `${selected_carrier.currency} ${selected_carrier.total_cost}`);
      console.log('⭐ Rating:', selected_carrier.rating);
      console.log('🛡️ Insurance:', selected_carrier.insurance_available ? 'Yes' : 'No');
      console.log('📍 Tracking:', selected_carrier.tracking_available ? 'Yes' : 'No');
      console.log('📋 Applied Filters:', selection_criteria);
    }
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

/**
 * Example 6: Legacy Cost Calculation (Backward Compatibility)
 * Shows how the old calculateCost method now uses smart selection
 */
export async function exampleLegacyCostCalculation() {
  console.log('\n🔄 Example 6: Legacy Cost Calculation (Now Smart!)');
  
  try {
    // Without carrier ID - uses smart selection
    const result1 = await sdk.calculateCost(
      'Warri, Nigeria',
      'Benin City, Nigeria',
      4.0 // 4kg package
    );

    if (result1.success && result1.data) {
      console.log('✅ Smart Cost Estimate:', `${result1.data.currency} ${result1.data.estimated_cost}`);
    }

    // With specific carrier ID - uses original logic
    const result2 = await sdk.calculateCost(
      'Warri, Nigeria',
      'Benin City, Nigeria',
      4.0,
      'carrier-001' // specific carrier
    );

    if (result2.success && result2.data) {
      console.log('✅ Specific Carrier Cost:', `${result2.data.currency} ${result2.data.estimated_cost}`);
    }
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

/**
 * Run all examples
 */
export async function runAllExamples() {
  console.log('🚀 Running Smart Carrier Selection Examples\n');
  
  await exampleBalancedSelection();
  await exampleCheapestSelection();
  await exampleBestRatedSelection();
  await exampleDestinationFocusedSelection();
  await exampleCustomCriteriaSelection();
  await exampleLegacyCostCalculation();
  
  console.log('\n✨ All examples completed!');
}

// Uncomment to run examples directly
// runAllExamples().catch(console.error);
