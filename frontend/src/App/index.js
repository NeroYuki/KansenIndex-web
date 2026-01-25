import { Flex, Box, Heading} from '@chakra-ui/react';
import { useState } from 'react';
import './App.css';
import { NavigationTop } from './Component';
import { TopNavigation } from './Route';
import { ContentFilterProvider } from './Context/ContentFilterContext';

function App() {

	return (
		<div className="App">
			<ContentFilterProvider>
				<TopNavigation/>
			</ContentFilterProvider>
		</div>
	);
}

export default App;
