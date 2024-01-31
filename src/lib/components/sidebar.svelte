<script lang="ts">
	import { Button } from '$lib/components/ui/button';

	const routes = [
		{
			name: 'Content',
			path: '/'
		},
		{
			name: 'Models',
			path: '/models'
		}
	];
</script>

<aside class="fixed left-0 top-0 flex h-[100svh] w-72 flex-col p-5">
	{#each routes as route (route.name)}
		<Button variant="link" href={route.path}>{route.name}</Button>
	{/each}
</aside>
