import React from 'react'
import { CropGuideAction } from '../types'

export interface CropGuideDetailsActionItemProps {
    action: CropGuideAction
}

export function CropGuideDetailsActionItem(props: CropGuideDetailsActionItemProps) {
  return <div>
        <pre>
            {JSON.stringify(props.action, null, 2)}
        </pre>
    </div>
    
    
}