# agent.py

import os
from typing import List, Optional
from groq import Groq
import json

class GroqAgent:
    def __init__(self, api_key: Optional[str] = None):
        self.api_key = "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"
        if not self.api_key:
            raise ValueError("Groq API key must be provided")
        
        self.client = Groq(api_key=self.api_key)

    def extract_products(self, title: Optional[str], description: Optional[str]) -> List[str]:
        """
        Extract product-related single words from title and description.
        Returns a list of single words and related terms.
        """
        content = f"Title: {title or ''}\nDescription: {description or ''}"
        prompt = f"""Given the following title and description, identify potential product-related terms.
        
    {content}

    1. Break down multi-word product names into their individual components. For example, "gaming laptop" should become ["gaming", "laptop"].
    2. Identify other items or accessories that would commonly be used alongside these products. For example, if "laptop" is identified, include related terms like "charger", "mouse", or "keyboard".
    3. Return only a JSON array of single words representing these products and their related items. For example: ["gaming", "laptop", "mouse", "keyboard", "charger"].
    4. Give it in a single array , dont give any nested arrays of anything else , just all products in a single array

    Ensure the output is a valid JSON array."""
        
        try:
            completion = self.client.chat.completions.create(
                model="llama-3.3-70b-versatile",
                messages=[
                    {"role": "user", "content": prompt}
                ],
                temperature=0.7,
                max_completion_tokens=1024,
                top_p=1,
                stream=False
            )
            
            response = completion.choices[0].message.content.strip()
            
            try:
                products = json.loads(response)
                if isinstance(products, list):
                    return [p.strip().lower() for p in products if p.strip()]
            except json.JSONDecodeError:
                return [word.strip().lower() for word in response.split() if len(word.strip()) > 3]
                
        except Exception as e:
            print(f"Groq API error: {str(e)}")
            words = []
            if title:
                words.extend(title.split())
            if description:
                words.extend(description.split())
            return [word.strip().lower() for word in words if len(word.strip()) > 3]


def get_products_from_list(title: Optional[str], description: Optional[str]) -> List[str]:
    agent = GroqAgent()
    answer = agent.extract_products(title, description)
    print(answer)
    return answer