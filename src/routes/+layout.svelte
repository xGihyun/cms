<script>
	import { Sidebar } from '$lib/components';
	import { Toaster } from '$lib/components/ui/sonner';
	import '../app.pcss';
</script>

<Toaster closeButton />
<Sidebar />
<div class="pl-72">
	<main class="px-[5%] py-10">
		<slot />
	</main>
</div>
