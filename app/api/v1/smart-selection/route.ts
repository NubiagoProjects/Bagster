import { NextRequest, NextResponse } from 'next/server';

interface CarrierScore {
  id: string;
  name: string;
  rating: number;
  total_cost: number;
  price_per_kg: number;
  delivery_time: string;
  transport_modes: string[];
  services: string[];
  insurance_available: boolean;
  tracking_available: boolean;
  currency: string;
  deliveryCountries: string[];
  status: string;
  // Scoring fields
  priceScore: number;
  ratingScore: number;
  destinationScore: number;
  totalScore: number;
  selectionReason: string;
}

interface SelectionCriteria {
  prioritize: 'cheapest' | 'best_rated' | 'balanced' | 'destination_focused';
  destination_country: string;
  max_price?: number;
  min_rating?: number;
  required_services?: string[];
}

// Get carriers data from existing endpoint
async function getCarriersWithRates(origin: string, destination: string, weight: number, options: any = {}) {
  const params = new URLSearchParams({
    origin,
    destination,
    weight: weight.toString(),
    ...options
  });

  // Simulate internal API call to rates endpoint
  const ratesResponse = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/v1/rates?${params}`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' }
  });

  if (!ratesResponse.ok) {
    throw new Error('Failed to fetch rates');
  }

  return await ratesResponse.json();
}

// Get carrier details from carriers endpoint
async function getCarrierDetails() {
  const carriersResponse = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/v1/carriers`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' }
  });

  if (!carriersResponse.ok) {
    throw new Error('Failed to fetch carrier details');
  }

  return await carriersResponse.json();
}

function calculateCarrierScores(
  carriersWithRates: any[], 
  carrierDetails: any[], 
  criteria: SelectionCriteria
): CarrierScore[] {
  const scoredCarriers: CarrierScore[] = [];

  // Define weights based on selection criteria
  const weights = {
    cheapest: { price: 0.7, rating: 0.2, destination: 0.1 },
    best_rated: { price: 0.2, rating: 0.6, destination: 0.2 },
    balanced: { price: 0.4, rating: 0.35, destination: 0.25 },
    destination_focused: { price: 0.3, rating: 0.2, destination: 0.5 }
  };

  const weight = weights[criteria.prioritize] || weights.balanced;

  // Find min/max values for normalization
  const prices = carriersWithRates.map(c => c.total_cost);
  const ratings = carriersWithRates.map(c => c.rating);
  
  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);
  const minRating = Math.min(...ratings);
  const maxRating = Math.max(...ratings);

  for (const rateCarrier of carriersWithRates) {
    // Find matching carrier details
    const carrierDetail = carrierDetails.find(c => c.id === rateCarrier.id);
    
    // Skip if carrier is not approved
    if (carrierDetail?.status !== 'approved') {
      continue;
    }

    // Apply filters
    if (criteria.max_price && rateCarrier.total_cost > criteria.max_price) {
      continue;
    }
    
    if (criteria.min_rating && rateCarrier.rating < criteria.min_rating) {
      continue;
    }

    // Calculate normalized scores (0-1)
    const priceScore = maxPrice === minPrice ? 1 : 
      (maxPrice - rateCarrier.total_cost) / (maxPrice - minPrice);
    
    const ratingScore = maxRating === minRating ? 1 : 
      (rateCarrier.rating - minRating) / (maxRating - minRating);
    
    // Destination score: 1 if serves destination country, 0.5 otherwise
    const destinationScore = carrierDetail?.deliveryCountries?.includes(criteria.destination_country) ? 1 : 0.5;

    // Calculate weighted total score
    const totalScore = (
      priceScore * weight.price +
      ratingScore * weight.rating +
      destinationScore * weight.destination
    );

    // Generate selection reason
    let selectionReason = '';
    if (priceScore >= 0.8) selectionReason += 'Excellent price. ';
    if (ratingScore >= 0.8) selectionReason += 'Top-rated carrier. ';
    if (destinationScore === 1) selectionReason += `Specializes in ${criteria.destination_country} deliveries. `;
    if (!selectionReason) selectionReason = 'Good overall balance of price, rating, and service.';

    scoredCarriers.push({
      id: rateCarrier.id,
      name: rateCarrier.name,
      rating: rateCarrier.rating,
      total_cost: rateCarrier.total_cost,
      price_per_kg: rateCarrier.price_per_kg,
      delivery_time: rateCarrier.delivery_time,
      transport_modes: rateCarrier.transport_modes,
      services: rateCarrier.services,
      insurance_available: rateCarrier.insurance_available,
      tracking_available: rateCarrier.tracking_available,
      currency: rateCarrier.currency,
      deliveryCountries: carrierDetail?.deliveryCountries || [],
      status: carrierDetail?.status || 'unknown',
      priceScore: Math.round(priceScore * 100) / 100,
      ratingScore: Math.round(ratingScore * 100) / 100,
      destinationScore: Math.round(destinationScore * 100) / 100,
      totalScore: Math.round(totalScore * 100) / 100,
      selectionReason: selectionReason.trim()
    });
  }

  // Sort by total score (highest first)
  return scoredCarriers.sort((a, b) => b.totalScore - a.totalScore);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate required fields
    const { origin, destination, weight, selection_criteria } = body;
    
    if (!origin || !destination || !weight) {
      return NextResponse.json({
        success: false,
        error: 'Missing required fields: origin, destination, weight'
      }, { status: 400 });
    }

    // Default selection criteria
    const criteria: SelectionCriteria = {
      prioritize: 'balanced',
      destination_country: destination.split(',').pop()?.trim() || 'Nigeria',
      ...selection_criteria
    };

    // Get rates and carrier details
    const [ratesData, carriersData] = await Promise.all([
      getCarriersWithRates(origin, destination, weight, body.options || {}),
      getCarrierDetails()
    ]);

    if (!ratesData.success || !carriersData.success) {
      return NextResponse.json({
        success: false,
        error: 'Failed to fetch carrier data'
      }, { status: 500 });
    }

    // Calculate scores and select best carriers
    const scoredCarriers = calculateCarrierScores(
      ratesData.data.carriers,
      carriersData.data.carriers,
      criteria
    );

    if (scoredCarriers.length === 0) {
      return NextResponse.json({
        success: false,
        error: 'No suitable carriers found for the given criteria'
      }, { status: 404 });
    }

    // Get top 3 recommendations
    const recommendations = scoredCarriers.slice(0, 3);
    const selectedCarrier = recommendations[0];

    return NextResponse.json({
      success: true,
      data: {
        selected_carrier: selectedCarrier,
        recommendations: recommendations,
        selection_criteria: criteria,
        total_evaluated: scoredCarriers.length,
        scoring_breakdown: {
          weights_used: {
            price: criteria.prioritize === 'cheapest' ? 0.7 : 
                   criteria.prioritize === 'best_rated' ? 0.2 :
                   criteria.prioritize === 'destination_focused' ? 0.3 : 0.4,
            rating: criteria.prioritize === 'cheapest' ? 0.2 : 
                    criteria.prioritize === 'best_rated' ? 0.6 :
                    criteria.prioritize === 'destination_focused' ? 0.2 : 0.35,
            destination: criteria.prioritize === 'cheapest' ? 0.1 : 
                        criteria.prioritize === 'best_rated' ? 0.2 :
                        criteria.prioritize === 'destination_focused' ? 0.5 : 0.25
          },
          explanation: `Selected based on ${criteria.prioritize} strategy. ${selectedCarrier.selectionReason}`
        },
        route_info: {
          origin,
          destination,
          weight,
          estimated_distance_km: ratesData.data.estimated_distance_km
        }
      }
    });

  } catch (error) {
    console.error('Smart selection error:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to perform smart carrier selection'
    }, { status: 500 });
  }
}

// GET endpoint for quick selection with query params
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    const origin = searchParams.get('origin');
    const destination = searchParams.get('destination');
    const weight = searchParams.get('weight');
    const prioritize = searchParams.get('prioritize') || 'balanced';
    
    if (!origin || !destination || !weight) {
      return NextResponse.json({
        success: false,
        error: 'Missing required parameters: origin, destination, weight'
      }, { status: 400 });
    }

    // Convert to POST request format
    const body = {
      origin,
      destination,
      weight: parseFloat(weight),
      selection_criteria: {
        prioritize: prioritize as 'cheapest' | 'best_rated' | 'balanced' | 'destination_focused',
        destination_country: destination.split(',').pop()?.trim() || 'Nigeria'
      }
    };

    // Reuse POST logic
    const postRequest = new Request(request.url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });

    return await POST(postRequest as NextRequest);

  } catch (error) {
    console.error('Smart selection GET error:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to perform smart carrier selection'
    }, { status: 500 });
  }
}
