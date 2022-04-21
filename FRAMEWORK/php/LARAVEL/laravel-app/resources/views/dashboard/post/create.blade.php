@extends('dashboard.layouts.main')
@section('content')
<div class="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
    <h1 class="h2">Create new post</h1>
</div>

<div class="col-lg-8">

    <form method="post" action="/dashboard/posts">
        @csrf
        <div class="mb-3">
            <label for="title" class="form-label">Title</label>
            <input type="text" class="form-control" name="title" id="title">
            <div id="" class="form-text">We'll never share your email with anyone else.</div>
        </div>
        <div class="mb-3">
            <label for="slug" class="form-label">Slug</label>
            <input type="text" class="form-control" name="slug" id="slug">
        </div>

        <div class="mb-3">
            <label for="category" class="form-label">Category</label>
            <select class="form-select" aria-label="" name="category_id">
                @foreach($categories as $c)
                <option value="{{$c->id}}">{{$c->name}}</option>
                @endforeach
            </select>
        </div>

        <div class="mb-3">
            <label for="category" class="form-label"> Body </label>
            <input id="body" type="hidden" name="body">
            <trix-editor input="body">
            </trix-editor>
        </div>


        <button type="submit" class="btn btn-primary">Create post</button>
    </form>

</div>

<script>
    const title = document.querySelector('#title');
    const slug = document.querySelector('#slug');


    title.addEventListener('change', function(e) {
        fetch('/dashboard/posts/checkSlug?title=' + title.value).then(response => response.json()).then(data => slug.value = data.slug);
    });

    document.addEventListener('trix-file-accept', function(e) {
        e.preventDefault();
    });

</script>

@endsection
