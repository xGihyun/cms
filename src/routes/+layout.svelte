<script>
	import { Sidebar } from '$lib/components';
	import { Toaster } from '$lib/components/ui/sonner';
	import '../app.pcss';
</script>

<Toaster closeButton />
<Sidebar />
<main class="pl-72">
	<slot />
</main>
