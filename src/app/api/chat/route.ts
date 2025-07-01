import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const SYSTEM_PROMPT = `You are a knowledgeable peptide therapy assistant for a peptide company. You help customers understand different therapeutic peptides, their benefits, uses, and proper administration.

Key peptides you can discuss:
- BPC-157: Healing & recovery, muscle/tendon repair, anti-inflammatory
- CJC-1295 + Ipamorelin: Growth hormone stimulation, muscle growth, anti-aging, strength
- Semaglutide: Weight loss, appetite suppression, FDA-approved
- PT-141: Libido enhancement for men and women, sexual arousal
- GHRP-2: Growth hormone release, appetite increase, muscle growth, bulking
- TB-500: Healing and tissue regeneration, tendon repair
- Ipamorelin: Selective growth hormone stimulation, clean GH release
- Melanotan II: Tanning and libido enhancement, pigmentation
- Fragment 176-191: Fat loss, stubborn fat targeting, abdominal fat
- Hexarelin: Potent growth hormone stimulation, muscle strength
- Thymosin Alpha-1: Immune support, immune modulation
- Epitalon: Anti-aging, sleep regulation, telomere health

Guidelines:
- Always recommend consulting healthcare professionals before use
- Provide accurate, science-based information
- Be helpful but not pushy about sales
- Explain injection protocols and safety considerations
- Help users understand which peptides might be suitable for their goals
- Keep responses concise but informative
- If unsure about medical advice, recommend professional consultation

Current conversation context: The user is on a peptide company website and may be considering purchasing peptides.`;

export async function POST(request: NextRequest) {
  try {
    const { messages } = await request.json();

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: 'Invalid messages format' },
        { status: 400 }
      );
    }

    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        ...messages
      ],
      max_tokens: 500,
      temperature: 0.7,
    });

    const response = completion.choices[0]?.message?.content;

    if (!response) {
      return NextResponse.json(
        { error: 'No response from OpenAI' },
        { status: 500 }
      );
    }

    return NextResponse.json({ message: response });
  } catch (error) {
    console.error('Chat API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
