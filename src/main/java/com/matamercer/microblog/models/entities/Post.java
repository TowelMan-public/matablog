package com.matamercer.microblog.models.entities;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.Type;

import javax.persistence.*;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "posts")
@Getter
@Setter
public class Post extends BaseModel {
    @ManyToOne
    @JoinColumn(name = "blog_id")
    private Blog blog;

    @ManyToMany
    @JoinTable(name = "post_posttag",
        joinColumns = { @JoinColumn(name = "post_id") },
        inverseJoinColumns = { @JoinColumn(name = "posttag_id" ) }
    )
    private Set<PostTag> postTags = new HashSet<>();

    @Type(type = "text")
    private String title;

    @Type(type = "text")
    @Column(nullable = false)
    private String content;

    @Type(type = "boolean")
    @Column(nullable = false)
    private boolean isCommunityTaggingEnabled;

    @Type(type = "boolean")
    @Column(nullable = false)
    private boolean isSensitive;
}
