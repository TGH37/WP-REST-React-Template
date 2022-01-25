import React, { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

interface Props {}

function useWPCategoryFilter(props: Props) {
    const {} = props

    const [URLSearchParams] = useSearchParams();

    const [category, setCategory] = useState<string | null>(URLSearchParams.get('category'));

      useEffect(() => {
        setCategory(URLSearchParams.get('category'))
      },[URLSearchParams.get('category')])
      
      const validCategories = useMemo(() => {
          enum RecipeCategoryEnum {
              beginner = "beginner",
              intermediate = "intermediate",
              expert = "expert",
              all = "all"
            };
            
            const isRecipeCategoryValid = (valueIn: string): valueIn is RecipeCategoryEnum => {
                return Object.keys(RecipeCategoryEnum).includes(valueIn)
            };
            
            const categoryArry = category ? category.split(",") : ['all'];
            return categoryArry.flatMap((category) => {
                const isValidFilter = isRecipeCategoryValid(category);
                if(!isValidFilter) {
                    console.log(`Invalid category filter ${category}, please select a valid filter from: ${Object.keys(RecipeCategoryEnum).join(" | ")}`);
                    return [];
                };
                return [category];
            });
        }, [category])

    return validCategories
}

export default useWPCategoryFilter
